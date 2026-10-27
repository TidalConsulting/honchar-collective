"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The editorial photo behind the hero headline.
 *
 * Drop a campaign or flat-lay photo into `public/` named `hero.jpg`, `hero.png`, or
 * `hero.webp` and it appears — no code change. Each candidate is tried in turn,
 * so the file extension doesn't have to be settled in advance.
 *
 * If none of them load this renders nothing and the hero's own dark background
 * shows through. That degrades quietly: the headline sits on a plain dark panel
 * rather than a broken-image icon or a stretched placeholder.
 */
const CANDIDATES = process.env.NEXT_PUBLIC_HERO_FILE
  ? [process.env.NEXT_PUBLIC_HERO_FILE]
  : ["/hero.jpg", "/hero.png", "/hero.webp"];

export function HeroImage({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const next = () => setIndex((current) => current + 1);

  // A server-rendered image can finish failing before React hydrates, so the
  // onError below never fires. Check the element's own state on mount too.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) next();
  }, [index]);

  if (index >= CANDIDATES.length) return null;

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      ref={imgRef}
      key={CANDIDATES[index]}
      src={CANDIDATES[index]}
      alt=""
      aria-hidden="true"
      className={className}
      onError={next}
    />
  );
}
