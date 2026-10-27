import { site } from "@/lib/site";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const num = new Intl.NumberFormat("en-US");

export function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return "Price on request";
  return usd.format(value);
}

/** "≈ RD$ 157,500" — rounded to the nearest 100 pesos so it reads as an estimate. */
export function formatDop(usdValue: number | null | undefined) {
  if (usdValue === null || usdValue === undefined) return null;
  const pesos = Math.round((usdValue * site.dopPerUsd) / 100) * 100;
  return `≈ RD$ ${num.format(pesos)}`;
}

export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return num.format(value);
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

/** "Nov 12" — for arrival dates, which are always in the next few weeks. */
export function formatShortDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
    new Date(value),
  );
}

export function formatDateTime(value: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

/** "Louis Vuitton Neverfull MM" */
export function itemTitle(i: { brand: string; name: string }) {
  return `${i.brand} ${i.name}`;
}

export const CONDITION_LABEL: Record<string, string> = {
  NEW: "New",
  EXCELLENT: "Excellent",
  VERY_GOOD: "Very Good",
  GOOD: "Good",
  FAIR: "Fair",
};

/** What each grade means, shown on the detail page and in the filters. */
export const CONDITION_DETAIL: Record<string, string> = {
  NEW: "Never used. Tags, stickers, or protective film still in place.",
  EXCELLENT: "Used a handful of times. No visible wear without close inspection.",
  VERY_GOOD: "Light signs of use, such as faint corner rubbing or hardware scratches.",
  GOOD: "Visible wear consistent with regular use. Structurally sound.",
  FAIR: "Noticeable wear or repairs, priced accordingly. Every flaw is photographed.",
};

export const CONDITION_ORDER = ["NEW", "EXCELLENT", "VERY_GOOD", "GOOD", "FAIR"] as const;

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Percentage below the boutique price, or null when there's nothing to compare. */
export function percentOffRetail(price: number, retail: number | null | undefined) {
  if (!retail || retail <= price) return null;
  return Math.round(((retail - price) / retail) * 100);
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** The moment `days` days ago. */
export function daysAgo(days: number) {
  return new Date(Date.now() - days * DAY_MS);
}

/** True when `value` falls within the last `days` days — drives the "Just in" badge. */
export function isWithinDays(value: Date | string, days: number) {
  return Date.now() - new Date(value).getTime() < days * DAY_MS;
}
