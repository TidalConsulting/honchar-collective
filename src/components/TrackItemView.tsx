"use client";

import { useEffect, useRef } from "react";

/**
 * Reports that someone opened a particular item's listing.
 *
 * ViewContent is what gives Meta something to retarget on — "people who looked
 * at a Chanel bag but didn't enquire" is the audience worth paying to reach
 * again, and it can't be built without this.
 *
 * Deliberately browser-only, with no server counterpart: this isn't a
 * conversion, there's nothing to deduplicate against, and a page view is
 * exactly the sort of thing the pixel is good at.
 */
export function TrackItemView({
  id,
  title,
  price,
}: {
  id: string;
  title: string;
  price: number;
}) {
  const reported = useRef<string | null>(null);

  useEffect(() => {
    // The pixel script is injected after hydration, so it may not be ready on
    // the first pass. Retry briefly rather than dropping the event.
    let attempts = 0;
    const send = () => {
      if (reported.current === id) return true;
      if (typeof window.fbq !== "function") return false;
      reported.current = id;
      window.fbq("track", "ViewContent", {
        content_ids: [id],
        content_name: title,
        content_type: "product",
        value: price,
        currency: "USD",
      });
      return true;
    };

    if (send()) return;
    const timer = setInterval(() => {
      attempts += 1;
      if (send() || attempts > 20) clearInterval(timer);
    }, 250);
    return () => clearInterval(timer);
  }, [id, title, price]);

  return null;
}
