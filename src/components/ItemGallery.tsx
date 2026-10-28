"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { ItemIllustration } from "@/components/ItemIllustration";
import { useT } from "@/lib/i18n/client";

type GalleryImage = { id: string; url: string; alt: string | null };

export function ItemGallery({
  images,
  category,
  color,
  brand,
  title,
}: {
  images: GalleryImage[];
  category: string;
  color: string | null;
  brand: string;
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const { t } = useT();

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomed(false);
      if (event.key === "ArrowRight") setIndex((value) => (value + 1) % images.length);
      if (event.key === "ArrowLeft") setIndex((value) => (value - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed, images.length]);

  if (images.length === 0) {
    return (
      <div className="overflow-hidden rounded-card border border-ink-200 bg-surface">
        <ItemIllustration
          category={category}
          color={color}
          brand={brand}
          className="aspect-[4/5] w-full"
        />
        <p className="border-t border-ink-200 px-4 py-3 text-center text-sm text-ink-500">
          {t.item.photosPending}
        </p>
      </div>
    );
  }

  const current = images[Math.min(index, images.length - 1)];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-ink-200 bg-ink-100">
        <Image
          src={current.url}
          alt={current.alt || title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="cursor-zoom-in object-cover"
          onClick={() => setZoomed(true)}
        />

        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white">
          {index + 1} / {images.length}
        </span>

        {images.length > 1 && (
          <>
            <ArrowButton
              side="left"
              onClick={() => setIndex((value) => (value - 1 + images.length) % images.length)}
            />
            <ArrowButton
              side="right"
              onClick={() => setIndex((value) => (value + 1) % images.length)}
            />
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, thumbIndex) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setIndex(thumbIndex)}
              aria-label={t.item.viewPhoto(thumbIndex + 1)}
              className={`relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                thumbIndex === index ? "border-gold-500" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t.item.viewer(title)}
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label={t.item.closeViewer}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="relative h-full max-h-[85vh] w-full max-w-6xl">
            <Image
              src={current.url}
              alt={current.alt || title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ArrowButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const { t } = useT();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? t.card.prevPhoto : t.card.nextPhoto}
      className={`absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-gold-300 shadow transition hover:bg-black ${
        side === "left" ? "left-3" : "right-3"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d={side === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
