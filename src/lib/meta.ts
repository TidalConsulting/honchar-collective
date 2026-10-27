import "server-only";

import { createHash } from "node:crypto";

import { site } from "@/lib/site";
import { isPublicSite } from "@/lib/url";

/**
 * The Conversions API — the server-side half of Meta tracking.
 *
 * The pixel in the browser loses somewhere between a fifth and nearly half of
 * conversions to ad blockers, Safari's tracking prevention and iOS opt-outs,
 * and those losses land hardest on mobile. Meta bids off conversion data, so
 * under-reporting leads doesn't only mis-measure the ads, it makes them
 * perform worse. This sends the same Lead event from the server, where none of
 * that applies.
 *
 * DEDUPLICATION is the thing to get right. Browser and server both report the
 * same lead, and Meta only collapses them when `event_id` and `event_name`
 * match. Without that every enquiry counts twice: reported conversions double,
 * cost-per-lead reads at half what it really is, and the bidding optimises
 * against a number that isn't real. The lead's own database id is used as the
 * event id — unique already, and known to both sides.
 *
 * Dormant until META_CAPI_TOKEN is set, like the notification channels.
 */

const TIMEOUT_MS = 8000;

/** Meta deprecates Graph API versions on a rolling basis; override if it errors. */
const API_VERSION = process.env.META_API_VERSION?.trim() || "v21.0";

export type LeadEvent = {
  /** Doubles as the deduplication key against the browser's pixel event. */
  eventId: string;
  email: string | null;
  phone: string | null;
  name: string;
  sourceUrl: string;
  /** From the request, to improve the match. */
  userAgent: string | null;
  clientIp: string | null;
  /** Meta's own browser cookies — the strongest match signals available. */
  fbp: string | null;
  fbc: string | null;
  item: { title: string; price: number } | null;
};

/** Meta requires every identifier SHA-256 hashed, lowercase hex, normalised first. */
function hash(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalised = value.trim().toLowerCase();
  if (!normalised) return null;
  return createHash("sha256").update(normalised).digest("hex");
}

/** Digits only, with the US country code, which is how Meta wants phone numbers. */
function hashPhone(phone: string | null): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 10) digits = `1${digits}`;
  return hash(digits);
}

function splitName(name: string): { first: string | null; last: string | null } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: null, last: null };
  if (parts.length === 1) return { first: parts[0], last: null };
  return { first: parts[0], last: parts[parts.length - 1] };
}

/** Logged once per cold start, so a misconfiguration is visible without spamming. */
let warnedAboutToken = false;

export async function sendLeadToMeta(event: LeadEvent): Promise<void> {
  const token = process.env.META_CAPI_TOKEN?.trim();
  const pixelId = site.metaPixelId;

  // Same rule as the pixel: real site, real traffic, or nothing.
  if (!isPublicSite() || !pixelId) return;

  if (!token) {
    // Staying silent here made "the token isn't reaching the runtime" look
    // identical to "the request failed" — the one thing worth telling apart
    // when leads aren't showing up in Events Manager.
    if (!warnedAboutToken) {
      warnedAboutToken = true;
      console.warn(
        "META_CAPI_TOKEN is not set, so leads are only being reported by the browser pixel. " +
          "Set it in the hosting environment and redeploy to turn on server-side reporting.",
      );
    }
    return;
  }

  const { first, last } = splitName(event.name);

  // Only non-empty identifiers are sent; Meta rejects nulls in these arrays.
  const userData: Record<string, unknown> = {};
  const put = (key: string, value: string | null) => {
    if (value) userData[key] = [value];
  };

  put("em", hash(event.email));
  put("ph", hashPhone(event.phone));
  put("fn", hash(first));
  put("ln", hash(last));

  if (event.userAgent) userData.client_user_agent = event.userAgent;
  if (event.clientIp) userData.client_ip_address = event.clientIp;
  if (event.fbp) userData.fbp = event.fbp;
  if (event.fbc) userData.fbc = event.fbc;

  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        action_source: "website",
        event_source_url: event.sourceUrl,
        user_data: userData,
        custom_data: event.item
          ? {
              content_name: event.item.title,
              value: event.item.price,
              currency: "USD",
            }
          : undefined,
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      // The body names the problem — a stale API version, a revoked token —
      // and none of it is anything the customer should ever see.
      console.error(
        `Lead ${event.eventId}: Meta Conversions API rejected the event (${response.status}).`,
        await response.text().catch(() => ""),
      );
    }
  } catch (error) {
    console.error(`Lead ${event.eventId}: Meta Conversions API call failed.`, error);
  }
}
