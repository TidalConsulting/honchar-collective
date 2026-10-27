"use server";

import { headers, cookies } from "next/headers";
import { after } from "next/server";

import { sendLeadToMeta } from "@/lib/meta";
import { notifyNewLead } from "@/lib/notify";
import { prisma } from "@/lib/prisma";
import { itemTitle } from "@/lib/format";
import { siteUrl } from "@/lib/url";
import { leadSchema } from "@/lib/validation";

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
  /**
   * The saved lead's id, handed back so the browser's pixel can report the
   * same Lead event under the same id. Meta collapses the pair instead of
   * counting the enquiry twice.
   */
  eventId?: string;
};

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  // Honeypot: real people leave this hidden field empty.
  if (formData.get("company")) {
    return { status: "success", message: "Thanks — we'll be in touch shortly." };
  }

  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? undefined,
    message: formData.get("message") ?? undefined,
    itemId: formData.get("itemId") ?? undefined,
    type: formData.get("type") ?? "AVAILABILITY",
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", errors };
  }

  const { itemId, ...lead } = parsed.data;

  // Only attach an item that actually exists, so a stale form can't fail the insert.
  const item = itemId
    ? await prisma.item.findUnique({
        where: { id: itemId },
        select: { id: true, brand: true, name: true, slug: true, price: true },
      })
    : null;

  const created = await prisma.lead.create({
    data: { ...lead, itemId: item?.id ?? null },
  });

  // after() runs once the response is on its way, so the customer isn't kept
  // waiting on Discord or an email API. The lead is already committed above —
  // notifying is a convenience for the team, never a condition of the enquiry
  // being accepted, so notifyNewLead swallows its own failures.
  // Read before after(): the request's headers and cookies aren't available
  // once the response has gone out.
  const requestHeaders = await headers();
  const requestCookies = await cookies();
  const forwardedFor = requestHeaders.get("x-forwarded-for");

  after(async () => {
    await notifyNewLead({
      id: created.id,
      name: created.name,
      email: created.email,
      phone: created.phone,
      message: created.message,
      type: created.type,
      item: item
        ? {
            title: itemTitle(item),
            slug: item.slug,
            price: item.price,
          }
        : null,
    });
  });

  after(async () => {
    await sendLeadToMeta({
      eventId: created.id,
      email: created.email,
      phone: created.phone,
      name: created.name,
      sourceUrl: item ? `${siteUrl()}/shop/${item.slug}` : `${siteUrl()}/contact`,
      userAgent: requestHeaders.get("user-agent"),
      // x-forwarded-for is a list; the client is the first entry.
      clientIp: forwardedFor?.split(",")[0]?.trim() ?? null,
      fbp: requestCookies.get("_fbp")?.value ?? null,
      fbc: requestCookies.get("_fbc")?.value ?? null,
      item: item
        ? { title: itemTitle(item), price: item.price }
        : null,
    });
  });

  return {
    status: "success",
    message: "Thanks — a member of our team will reach out within one business hour.",
    eventId: created.id,
  };
}
