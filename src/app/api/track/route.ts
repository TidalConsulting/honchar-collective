import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

/**
 * Records page views for the dashboard metrics.
 *
 * Deliberately minimal: a session id generated in the browser, the path, how
 * long the visitor stayed, and whether they tapped WhatsApp or call. No cookies, no IP addresses, no fingerprinting —
 * nothing that identifies a person, so this needs no consent banner.
 */

// Enough to keep crawlers out of the visit counts without pretending to be
// exhaustive. Bots that lie about their user agent will slip through; the point
// is that the obvious ones don't inflate the numbers.
const BOT = /bot|crawl|spider|slurp|bing|baidu|yandex|duckduck|facebookexternalhit|headless|lighthouse|preview|monitor|curl|wget|python-requests|axios|node-fetch/i;

const ID = /^[a-zA-Z0-9_-]{8,64}$/;

/** Everything the browser sends is untrusted; clip it before it reaches a column. */
function text(value: unknown, max = 100): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed ? trimmed : null;
}

/**
 * A view of /shop/<slug> is a view of that piece. Resolving it here rather
 * than trusting an id from the browser means the visit counts can't be aimed at
 * an item by anyone posting to this endpoint.
 */
async function itemFor(path: string): Promise<string | null> {
  const match = /^\/shop\/([a-z0-9-]{1,200})\/?$/i.exec(path);
  if (!match) return null;
  const item = await prisma.item.findUnique({
    where: { slug: match[1] },
    select: { id: true },
  });
  return item?.id ?? null;
}

export async function POST(request: Request) {
  if (BOT.test(request.headers.get("user-agent") ?? "")) {
    return NextResponse.json({ ok: true, skipped: "bot" });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const id = typeof data.id === "string" ? data.id : "";
  if (!ID.test(id)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  try {
    if (data.type === "view") {
      const sessionId = typeof data.sessionId === "string" ? data.sessionId : "";
      const path = typeof data.path === "string" ? data.path.slice(0, 500) : "/";
      if (!ID.test(sessionId)) {
        return NextResponse.json({ error: "Invalid session." }, { status: 400 });
      }
      // The same view can arrive twice if the browser retries; ignore repeats.
      await prisma.pageView.upsert({
        where: { id },
        update: {},
        create: {
          id,
          sessionId,
          path,
          itemId: await itemFor(path),
          source: text(data.source, 60),
          referrerHost: text(data.referrerHost, 253),
          utmSource: text(data.utmSource),
          utmMedium: text(data.utmMedium),
          utmCampaign: text(data.utmCampaign),
        },
      });
      return NextResponse.json({ ok: true });
    }

    if (data.type === "contact") {
      const sessionId = typeof data.sessionId === "string" ? data.sessionId : "";
      const path = typeof data.path === "string" ? data.path.slice(0, 500) : "/";
      const channel = data.channel === "phone" ? "phone" : "whatsapp";
      if (!ID.test(sessionId)) {
        return NextResponse.json({ error: "Invalid session." }, { status: 400 });
      }
      await prisma.contactTap.upsert({
        where: { id },
        update: {},
        create: {
          id,
          sessionId,
          path,
          channel,
          itemId: await itemFor(path),
          source: text(data.source, 60),
        },
      });
      return NextResponse.json({ ok: true });
    }

    if (data.type === "dwell") {
      // Cap at 30 minutes so a tab left open overnight can't skew the average.
      const ms = Math.min(Math.max(Number(data.ms) || 0, 0), 30 * 60 * 1000);
      await prisma.pageView.updateMany({
        where: { id },
        data: { dwellMs: Math.round(ms) },
      });
      return NextResponse.json({ ok: true });
    }
  } catch {
    // Analytics must never break a page. Swallow and move on.
    return NextResponse.json({ ok: false });
  }

  return NextResponse.json({ error: "Unknown type." }, { status: 400 });
}
