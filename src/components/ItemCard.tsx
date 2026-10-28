"use client";

import Link from "next/link";

import { ItemPhoto } from "@/components/ItemPhoto";
import { SaveButton } from "@/components/SaveButton";
import { estimatedInstalment } from "@/lib/finance";
import { formatDop, formatPrice, isWithinDays, itemTitle, percentOffRetail } from "@/lib/format";
import { useT } from "@/lib/i18n/client";
import { label, shortDate } from "@/lib/i18n/dictionaries";
import type { ItemCard as ItemCardData } from "@/lib/items";

const NEW_DAYS = 10;

export function ItemCard({
  item,
  priority = false,
}: {
  item: ItemCardData;
  priority?: boolean;
}) {
  const { lang, t } = useT();
  const title = itemTitle(item);
  const sold = item.status === "SOLD";
  const inTransit = !sold && item.arrival === "IN_TRANSIT";
  const drop =
    !sold && item.previousPrice && item.previousPrice > item.price
      ? item.previousPrice - item.price
      : null;
  const off = percentOffRetail(item.price, item.retailPrice);
  const instalment = sold ? null : estimatedInstalment(item.price);
  const isNew = !sold && isWithinDays(item.createdAt, NEW_DAYS);

  // One badge, in order of what a shopper most needs to know first.
  const badge = sold
    ? { label: t.card.sold, tone: "bg-ink-900 text-black" }
    : inTransit
      ? {
          label: item.arrivesAt ? t.card.arrives(shortDate(item.arrivesAt, lang)) : t.card.inTransit,
          tone: "border border-gold-500/60 bg-black/75 text-gold-300 backdrop-blur",
        }
      : item.featured
        ? { label: t.card.featured, tone: "bg-gold-500 text-black" }
        : isNew
          ? { label: t.card.justIn, tone: "border border-ink-700/40 bg-black/70 text-ink-900 backdrop-blur" }
          : null;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-ink-200 bg-surface transition-colors hover:border-gold-500/60">
      <div className="relative aspect-[4/5] w-full">
        <ItemPhoto
          images={item.images}
          category={item.category}
          color={item.color}
          brand={item.brand}
          title={title}
          priority={priority}
        />
        {/* A sold piece has to read as sold at a glance, before anyone gets as
            far as the price — hence the wash over the photo as well as a
            badge. */}
        {sold && <div className="absolute inset-0 z-10 bg-ink-50/60" aria-hidden="true" />}
        <SaveButton itemId={item.id} className="absolute right-3 top-3 z-20" />
        {badge && (
          <span
            className={`absolute left-3 top-3 z-20 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] ${badge.tone}`}
          >
            {badge.label}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold-500">
          {item.brand}
        </p>

        <h3 className="mt-1.5 font-serif text-lg leading-snug text-ink-900">
          <Link href={`/shop/${item.slug}`} className="after:absolute after:inset-0">
            {item.name}
          </Link>
        </h3>

        <p className="mt-1 text-sm text-ink-500">
          {[label(t.condition, item.condition), item.size ? t.card.size(item.size) : null, item.color]
            .filter(Boolean)
            .join(" · ")}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <p className="text-xl font-semibold tracking-tight text-ink-900 tabular-nums">
              {formatPrice(item.price)}
            </p>
            {item.retailPrice && item.retailPrice > item.price && (
              <span className="text-sm text-ink-400 line-through tabular-nums">
                {formatPrice(item.retailPrice)}
              </span>
            )}
            {drop ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden="true">
                  <path d="M12 20 4 9h16l-8 11Z" />
                </svg>
                {formatPrice(drop)}
              </span>
            ) : off ? (
              <span className="text-xs font-semibold text-gold-400">{t.card.belowRetail(off)}</span>
            ) : null}
          </div>

          <p className="mt-1 text-xs text-ink-500 tabular-nums">
            {sold
              ? t.card.soldNote
              : [formatDop(item.price), instalment ? t.card.layawayShort(formatPrice(instalment)) : null]
                  .filter(Boolean)
                  .join(" · ")}
          </p>

          {item.authenticated && !sold && (
            <p className="mt-2.5 flex items-center gap-1.5 text-xs text-ink-600">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gold-500" fill="none" aria-hidden="true">
                <path d="M12 3 5 6v6c0 4.4 3 8.2 7 9 4-.8 7-4.6 7-9V6l-7-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t.card.authenticated}
            </p>
          )}

          <span
            className={`relative z-10 mt-3.5 flex w-full items-center justify-center rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
              sold
                ? "border border-ink-300 text-ink-700 group-hover:border-ink-400"
                : "border border-gold-500 text-gold-300 group-hover:bg-gold-500 group-hover:text-black"
            }`}
          >
            {sold ? t.card.seeSold : inTransit ? t.card.reserve : t.card.check}
          </span>
        </div>
      </div>
    </article>
  );
}
