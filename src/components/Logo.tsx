"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Brand lockup.
 *
 * Until there's finished artwork this renders a typeset wordmark. To use real
 * artwork, put it in `public/` and set NEXT_PUBLIC_LOGO_FILE to its path
 * (e.g. "/logo.svg"). If that file ever fails to load, the wordmark comes back,
 * so the header is never broken.
 *
 * The site is black throughout, so supplied artwork should be gold or white on
 * a transparent background.
 */
const LOGO_FILE = process.env.NEXT_PUBLIC_LOGO_FILE || null;

export function Logo({ className = "" }: { className?: string }) {
  const [artworkFailed, setArtworkFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // The image is server-rendered, so the browser can finish failing to load it
  // before React hydrates and attaches onError — the event is then missed
  // entirely. Checking the element's own state on mount catches that case.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setArtworkFailed(true);
  }, []);

  if (LOGO_FILE && !artworkFailed) {
    return (
      <span className={`inline-flex ${className}`}>
        {/* A plain img rather than next/image: this one asset may be PNG or SVG
            depending on what the client supplies, and it needs an error handler
            to fall back. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={LOGO_FILE}
          alt="Honchar Collective"
          className="h-12 w-auto lg:h-14"
          onError={() => setArtworkFailed(true)}
        />
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-col items-start leading-none ${className}`}>
      <span className="font-serif text-[1.55rem] leading-none tracking-[0.14em] text-ink-900 lg:text-[1.75rem]">
        HONCHAR
      </span>
      <span className="mt-1.5 flex w-full items-center gap-2">
        <span className="h-px flex-1 bg-gold-500/70" />
        <span className="text-[0.58rem] font-medium uppercase leading-none tracking-[0.5em] text-gold-400">
          Collective
        </span>
        <span className="h-px flex-1 bg-gold-500/70" />
      </span>
    </span>
  );
}
