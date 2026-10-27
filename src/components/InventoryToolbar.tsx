"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { queryString, withParam, withToggledValue } from "@/lib/searchParams";
import { CONDITION_LABEL } from "@/lib/format";
import { SORT_OPTIONS } from "@/lib/sort";

/** Labels for the removable chips above the results grid. */
const KEY_LABEL: Record<string, string> = {
  q: "Search",
  category: "Category",
  brand: "Designer",
  condition: "Condition",
  size: "Size",
  gender: "For",
  arrival: "Where",
  availability: "Showing",
  priceMin: "Min price",
  priceMax: "Max price",
};

const MULTI_KEYS = new Set(["category", "brand", "condition", "size", "gender"]);

function displayValue(key: string, value: string) {
  if (key === "priceMin" || key === "priceMax") return `$${Number(value).toLocaleString()}`;
  if (key === "arrival") return value === "arriving" ? "Arriving soon" : "Ready now";
  if (key === "availability") return value === "sold" ? "Sold" : value === "all" ? "Everything" : value;
  if (key === "condition") return CONDITION_LABEL[value.toUpperCase()] ?? value;
  return value;
}

export function FilterChips() {
  const router = useRouter();
  const params = useSearchParams();

  const chips: { key: string; value: string }[] = [];
  params.forEach((value, key) => {
    if (["sort", "page"].includes(key) || !value) return;
    if (MULTI_KEYS.has(key)) {
      value
        .split(",")
        .filter(Boolean)
        .forEach((entry) => chips.push({ key, value: entry }));
    } else {
      chips.push({ key, value });
    }
  });

  if (chips.length === 0) return null;

  const remove = (key: string, value: string) => {
    const next = MULTI_KEYS.has(key)
      ? withToggledValue(params, key, value)
      : withParam(params, key, null);
    router.push(`/shop${queryString(next)}`, { scroll: false });
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={`${chip.key}:${chip.value}`}
          type="button"
          onClick={() => remove(chip.key, chip.value)}
          className="inline-flex items-center gap-2 rounded-full border border-ink-300 bg-surface py-1.5 pl-3 pr-2 text-sm font-medium text-ink-800 hover:border-gold-500"
        >
          <span className="text-ink-500">{KEY_LABEL[chip.key] ?? chip.key}:</span>
          {displayValue(chip.key, chip.value)}
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink-200 text-ink-700">
            <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      ))}
      <button
        type="button"
        onClick={() => router.push("/shop")}
        className="text-sm font-semibold text-gold-500 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}

export function SortSelect() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("sort") ?? "best";

  return (
    <label className="flex items-center gap-2 text-sm text-ink-600">
      <span className="hidden sm:inline">Sort:</span>
      <select
        value={current}
        onChange={(event) =>
          router.push(`/shop${queryString(withParam(params, "sort", event.target.value))}`, {
            scroll: false,
          })
        }
        className="rounded-full border border-ink-300 bg-surface px-4 py-2 text-sm font-medium text-ink-900"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  const router = useRouter();
  const params = useSearchParams();

  if (pageCount <= 1) return null;

  const go = (target: number) => {
    const next = new URLSearchParams(params);
    if (target <= 1) next.delete("page");
    else next.set("page", String(target));
    router.push(`/shop${queryString(next)}`);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = pageWindow(page, pageCount);

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-ink-300 bg-surface px-3 py-2 text-sm font-semibold text-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      {pages.map((entry, index) =>
        entry === null ? (
          <span key={`gap-${index}`} className="px-2 text-ink-400">
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            onClick={() => go(entry)}
            aria-current={entry === page ? "page" : undefined}
            className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold ${
              entry === page
                ? "bg-gold-500 text-black"
                : "border border-ink-300 bg-surface text-ink-800 hover:bg-ink-100"
            }`}
          >
            {entry}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= pageCount}
        className="rounded-lg border border-ink-300 bg-surface px-3 py-2 text-sm font-semibold text-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}

function pageWindow(page: number, pageCount: number): (number | null)[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);

  const pages = new Set<number>([1, pageCount, page, page - 1, page + 1]);
  const sorted = [...pages].filter((value) => value >= 1 && value <= pageCount).sort((a, b) => a - b);

  const result: (number | null)[] = [];
  let previous = 0;
  for (const value of sorted) {
    if (previous && value - previous > 1) result.push(null);
    result.push(value);
    previous = value;
  }
  return result;
}
