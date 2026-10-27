import "server-only";

import { siteUrl } from "@/lib/url";

/**
 * Pushing a new enquiry to the team the moment it lands.
 *
 * Leads are saved to the database first and always. Everything in here is a
 * best-effort notification on top of that: if Discord is down or the email key
 * is wrong, the enquiry is still recorded and still shows in the dashboard.
 * Nothing in this file is allowed to throw, because the caller's next move is
 * telling a customer their message went through — and it did.
 *
 * Both channels are driven by environment variables, so either can be turned
 * on, swapped, or switched off without touching code:
 *
 *   LEAD_NOTIFY_DISCORD_WEBHOOK   a Discord webhook URL
 *   RESEND_API_KEY + LEAD_NOTIFY_EMAIL   email via Resend
 *   LEAD_NOTIFY_FROM              sender address for the email
 */

export type LeadNotification = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  type: string;
  item: { title: string; slug: string; price: number } | null;
};

const TYPE_LABEL: Record<string, string> = {
  AVAILABILITY: "Availability",
  LAYAWAY: "Layaway",
  SOURCING: "Sourcing request",
  GENERAL: "General enquiry",
};

/** wa.me link for a number typed any old way. A bare 10-digit DR number gets its +1. */
function whatsappLink(phone: string) {
  const digits = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits.length === 10 ? `1${digits}` : digits}`;
}

/** A slow webhook must not hold the serverless invocation open indefinitely. */
const TIMEOUT_MS = 8000;

function describe(lead: LeadNotification) {
  const label = TYPE_LABEL[lead.type] ?? lead.type;
  const subject = lead.item
    ? `New ${label.toLowerCase()} lead — ${lead.item.title}`
    : `New ${label.toLowerCase()} lead from ${lead.name}`;
  return { label, subject, inboxUrl: `${siteUrl()}/admin/leads` };
}

export async function notifyNewLead(lead: LeadNotification): Promise<void> {
  // Run both, and let neither one's failure stop the other.
  await Promise.allSettled([sendDiscord(lead), sendEmail(lead)]);
}

async function sendDiscord(lead: LeadNotification): Promise<void> {
  const webhook = process.env.LEAD_NOTIFY_DISCORD_WEBHOOK?.trim();
  if (!webhook) return;

  const { label, subject, inboxUrl } = describe(lead);

  const fields = [
    { name: "Name", value: lead.name, inline: true },
    ...(lead.email ? [{ name: "Email", value: lead.email, inline: true }] : []),
    ...(lead.phone
      ? [{ name: "WhatsApp", value: `${lead.phone} · ${whatsappLink(lead.phone)}`, inline: true }]
      : []),
    { name: "About", value: label, inline: true },
    ...(lead.item
      ? [{ name: "Item", value: `${lead.item.title} — $${lead.item.price.toLocaleString()}`, inline: false }]
      : []),
    ...(lead.message ? [{ name: "Message", value: truncate(lead.message, 1000), inline: false }] : []),
  ];

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({
        username: "Honchar Collective",
        embeds: [
          {
            title: subject,
            url: inboxUrl,
            color: 0xffa62b,
            fields,
            footer: { text: "Reply from the dashboard, or just call them." },
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
    if (!response.ok) {
      console.error(`Lead ${lead.id}: Discord notification failed (${response.status}).`);
    }
  } catch (error) {
    console.error(`Lead ${lead.id}: Discord notification failed.`, error);
  }
}

async function sendEmail(lead: LeadNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.LEAD_NOTIFY_EMAIL?.trim();
  if (!apiKey || !to) return;

  const from = process.env.LEAD_NOTIFY_FROM?.trim() || "Honchar Collective <onboarding@resend.dev>";
  const { label, subject, inboxUrl } = describe(lead);

  const lines = [
    `${lead.name} got in touch through the website.`,
    "",
    ...(lead.email ? [`Email:    ${lead.email}`] : []),
    ...(lead.phone ? [`WhatsApp: ${lead.phone} — ${whatsappLink(lead.phone)}`] : []),
    `About:   ${label}`,
    ...(lead.item
      ? [`Item: ${lead.item.title} — $${lead.item.price.toLocaleString()}`]
      : []),
    "",
    ...(lead.message ? ["Their message:", lead.message, ""] : []),
    `All enquiries: ${inboxUrl}`,
  ];

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({
        from,
        to: to.split(",").map((address) => address.trim()).filter(Boolean),
        // Hitting reply goes straight to the customer rather than to a noreply
        // box — that's the whole point of the notification.
        ...(lead.email ? { reply_to: lead.email } : {}),
        subject,
        text: lines.join("\n"),
      }),
    });
    if (!response.ok) {
      console.error(
        `Lead ${lead.id}: email notification failed (${response.status}).`,
        await response.text().catch(() => ""),
      );
    }
  } catch (error) {
    console.error(`Lead ${lead.id}: email notification failed.`, error);
  }
}

function truncate(value: string, max: number) {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}
