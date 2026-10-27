"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ItemCard } from "@/components/ItemCard";
import { useSaved } from "@/lib/useSaved";
import type { ItemCard as ItemCardData } from "@/lib/items";

export default function SavedPage() {
  const { ids, ready } = useSaved();
  const key = ids.join(",");
  const [cache, setCache] = useState<{ key: string; items: ItemCardData[] } | null>(null);

  useEffect(() => {
    if (!ready || !key) return;

    const controller = new AbortController();
    fetch(`/api/items?ids=${key}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => setCache({ key, items: data.items ?? [] }))
      .catch(() => {
        if (!controller.signal.aborted) setCache({ key, items: [] });
      });

    return () => controller.abort();
  }, [key, ready]);

  // null means "still loading"; an empty array means "nothing saved".
  const items = !ready ? null : !key ? [] : cache?.key === key ? cache.items : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-500">Wishlist</p>
      <h1 className="mt-2 font-serif text-4xl text-ink-900 sm:text-5xl">Your saved pieces</h1>
      <p className="mt-2 text-ink-600">
        Saved on this device. Tap the heart on any listing to add it here.
      </p>

      {items === null ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-96 animate-pulse rounded-card border border-ink-200 bg-surface" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-card border border-dashed border-ink-300 bg-surface px-6 py-20 text-center">
          <h2 className="font-serif text-2xl text-ink-900">Nothing saved yet</h2>
          <p className="mx-auto mt-2 max-w-md text-ink-600">
            Browse the collection and tap the heart on anything you love.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-gold-400"
          >
            Shop the collection
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
