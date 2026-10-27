"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { classify, type Attribution } from "@/lib/attribution";

const SESSION_KEY = "honchar-collective:visit-session";
const SOURCE_KEY = "honchar-collective:visit-source";

function randomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * A session lasts as long as the browser tab. sessionStorage rather than a
 * cookie, so there is nothing to disclose and nothing that follows anyone
 * between visits.
 */
function sessionId() {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = randomId();
    window.sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    return randomId();
  }
}

/**
 * Where this visit came from, worked out once and then reused.
 *
 * It's captured on the first page of the session and stored, because the
 * referrer is only present on that first page — by the second click the
 * browser reports this site as the referrer, and a visit that came from a
 * Facebook ad would look like it came from nowhere. Carrying it forward is
 * what lets an item's views be broken down by channel.
 */
function attribution(): Attribution {
  const fallback: Attribution = {
    source: "Direct",
    referrerHost: null,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
  };

  try {
    const stored = window.sessionStorage.getItem(SOURCE_KEY);
    if (stored) return JSON.parse(stored) as Attribution;

    const fresh = classify(document.referrer, window.location.href, window.location.hostname);
    window.sessionStorage.setItem(SOURCE_KEY, JSON.stringify(fresh));
    return fresh;
  } catch {
    // Private mode, blocked storage, malformed JSON — none of it is worth
    // breaking a page over.
    try {
      return classify(document.referrer, window.location.href, window.location.hostname);
    } catch {
      return fallback;
    }
  }
}

/**
 * Records a tap on a WhatsApp or call button against the current page, so the
 * dashboard can count conversations that never touch a web form.
 */
export function trackContact(channel: "whatsapp" | "phone") {
  try {
    const body = JSON.stringify({
      type: "contact",
      id: randomId(),
      sessionId: sessionId(),
      path: window.location.pathname,
      channel,
      source: attribution().source,
    });
    // The tap usually opens another app straight away, so this has to survive
    // the page losing focus — the same reason the dwell beacon uses it.
    if (navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
      return;
    }
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Never let analytics get between a shopper and the conversation.
  }
}

/** Records the page view, then how long the visitor stayed, when they leave. */
export function VisitTracker() {
  const pathname = usePathname();
  const viewId = useRef<string | null>(null);
  const startedAt = useRef<number>(0);
  const sent = useRef(false);

  useEffect(() => {
    const id = randomId();
    viewId.current = id;
    startedAt.current = Date.now();
    sent.current = false;

    const from = attribution();
    const payload = JSON.stringify({
      type: "view",
      id,
      sessionId: sessionId(),
      path: pathname,
      source: from.source,
      referrerHost: from.referrerHost,
      utmSource: from.utmSource,
      utmMedium: from.utmMedium,
      utmCampaign: from.utmCampaign,
    });
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Never let analytics surface an error to a shopper.
    });

    const flush = () => {
      if (sent.current || !viewId.current) return;
      sent.current = true;
      const body = JSON.stringify({
        type: "dwell",
        id: viewId.current,
        ms: Date.now() - startedAt.current,
      });
      // sendBeacon survives the page being closed, which fetch does not.
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
          return;
        }
      } catch {
        // fall through to fetch
      }
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    };

    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };

    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flush);

    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flush);
      // Navigating to another page in the app ends this view too.
      flush();
    };
  }, [pathname]);

  return null;
}
