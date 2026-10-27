"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { hasValue, queryString, withParam, withToggledValue } from "@/lib/searchParams";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CONDITION_LABEL } from "@/lib/format";
import type { FacetCount, InventoryResult } from "@/lib/items";
import { site } from "@/lib/site";

export function InventoryFilters({
  facets,
  priceRange,
  total,
}: {
  facets: InventoryResult["facets"];
  priceRange: InventoryResult["priceRange"];
  total: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const push = (next: URLSearchParams) => {
    startTransition(() => router.push(`/shop${queryString(next)}`, { scroll: false }));
  };

  const toggle = (key: string, value: string) => push(withToggledValue(params, key, value));
  const set = (key: string, value: string | number | null) => push(withParam(params, key, value));

  const activeCount = countActive(params);

  return (
    <div className="space-y-3">
      <div className="rounded-card border border-ink-200 bg-surface p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-lg font-bold text-ink-900">
            {total.toLocaleString()} {total === 1 ? "result" : "results"}
          </p>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => router.push("/shop")}
              className="text-sm font-semibold text-gold-500 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <KeywordSearch />

        <div className="mt-4 rounded-lg border border-gold-500/40 bg-gold-50 p-4">
          <p className="font-serif text-lg text-ink-900">Looking for something specific?</p>
          <p className="mt-1 text-sm text-ink-600">
            Send us a photo and your size. We&apos;ll find it in the US.
          </p>
          <WhatsAppButton
            variant="compact"
            label="Ask on WhatsApp"
            message="Hi! I'm looking for a piece I don't see on the site."
            className="mt-3"
          />
        </div>
      </div>

      <Section title="Availability" defaultOpen>
        <RadioList
          name="availability"
          options={[
            { value: "available", label: "Still available" },
            { value: "sold", label: "Recently sold" },
            { value: "all", label: "Show both" },
          ]}
          counts={Object.fromEntries(facets.availability.map((row) => [row.value, row.count]))}
          // "available" is the default, so it lives as an absent param rather
          // than an explicit one — that keeps shared shop links clean.
          current={params.get("availability") ?? "available"}
          onSelect={(value) => set("availability", value === "available" ? null : value)}
          hideClear
        />
      </Section>

      <Section title="Where it is" defaultOpen>
        <RadioList
          name="arrival"
          options={[
            { value: "ready", label: `Ready now in ${site.city}` },
            { value: "arriving", label: "Arriving soon from the US" },
          ]}
          counts={Object.fromEntries(facets.arrival.map((row) => [row.value, row.count]))}
          current={params.get("arrival")}
          onSelect={(value) => set("arrival", value)}
        />
        <p className="mt-2 text-xs leading-relaxed text-ink-500">
          Pieces in transit can be reserved now. Usually {site.shippingDays} days door to door.
        </p>
      </Section>

      <Section title="Category" defaultOpen>
        <CheckList
          options={facets.category}
          checked={(value) => hasValue(params, "category", value)}
          onToggle={(value) => toggle("category", value)}
        />
      </Section>

      <Section title="Designer" defaultOpen>
        <CheckList
          options={facets.brand}
          scroll
          checked={(value) => hasValue(params, "brand", value)}
          onToggle={(value) => toggle("brand", value)}
        />
      </Section>

      <Section title="Price (USD)" defaultOpen>
        <RangeInputs
          minKey="priceMin"
          maxKey="priceMax"
          minPlaceholder={`$${priceRange.min.toLocaleString()}`}
          maxPlaceholder={`$${priceRange.max.toLocaleString()}`}
          prefix="$"
          onApply={(key, value) => set(key, value)}
        />
      </Section>

      <Section title="Condition">
        <CheckList
          options={facets.condition}
          label={(value) => CONDITION_LABEL[value] ?? value}
          checked={(value) => hasValue(params, "condition", value.toLowerCase())}
          onToggle={(value) => toggle("condition", value.toLowerCase())}
        />
      </Section>

      <Section title="Size">
        <CheckList
          options={facets.size}
          scroll
          checked={(value) => hasValue(params, "size", value)}
          onToggle={(value) => toggle("size", value)}
        />
      </Section>

      <Section title="For">
        <CheckList
          options={facets.gender}
          checked={(value) => hasValue(params, "gender", value)}
          onToggle={(value) => toggle("gender", value)}
        />
      </Section>
    </div>
  );
}

function countActive(params: URLSearchParams) {
  let count = 0;
  params.forEach((value, key) => {
    if (["sort", "page"].includes(key) || !value) return;
    count += value.split(",").filter(Boolean).length;
  });
  return count;
}

function KeywordSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const applied = params.get("q") ?? "";

  // Reset the draft whenever the applied search changes (back button, chip removal).
  const [value, setValue] = useState(applied);
  const [lastApplied, setLastApplied] = useState(applied);
  if (applied !== lastApplied) {
    setLastApplied(applied);
    setValue(applied);
  }

  return (
    <form
      className="relative mt-4"
      onSubmit={(event) => {
        event.preventDefault();
        router.push(`/shop${queryString(withParam(params, "q", value.trim()))}`, {
          scroll: false,
        });
      }}
    >
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Try “Neverfull” or “black heels”"
        aria-label="Search the collection"
        className="w-full rounded-full border border-ink-300 bg-ink-50 py-2.5 pl-4 pr-11 text-sm text-ink-900 placeholder:text-ink-400 focus:border-gold-400"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gold-500 text-black hover:bg-gold-400"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
          <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-card border border-ink-200 bg-surface [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-800">{title}</span>
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-ink-500 transition-transform group-open:rotate-180"
          fill="none"
        >
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="border-t border-ink-200 px-4 py-3.5">{children}</div>
    </details>
  );
}

function CheckList({
  options,
  checked,
  onToggle,
  label,
  scroll = false,
}: {
  options: FacetCount[];
  checked: (value: string) => boolean;
  onToggle: (value: string) => void;
  label?: (value: string) => string;
  scroll?: boolean;
}) {
  if (options.length === 0) {
    return <p className="text-sm text-ink-500">No matches with the current filters.</p>;
  }

  return (
    <div className={scroll ? "max-h-64 space-y-1 overflow-y-auto pr-1" : "space-y-1"}>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 text-sm hover:bg-ink-100"
        >
          <input
            type="checkbox"
            checked={checked(option.value)}
            onChange={() => onToggle(option.value)}
            className="h-4 w-4 rounded border-ink-300 accent-gold-500"
          />
          <span className="flex-1 text-ink-700">{label ? label(option.value) : option.value}</span>
          <span className="text-xs text-ink-400">({option.count})</span>
        </label>
      ))}
    </div>
  );
}

function RadioList({
  name,
  options,
  current,
  onSelect,
  counts,
  hideClear = false,
}: {
  name: string;
  options: { value: string; label: string }[];
  current: string | null;
  onSelect: (value: string | null) => void;
  counts?: Record<string, number>;
  /** For a list that always has one option selected, so "Clear" means nothing. */
  hideClear?: boolean;
}) {
  return (
    <div className="space-y-1">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 text-sm hover:bg-ink-100"
        >
          <input
            type="radio"
            name={name}
            checked={current === option.value}
            onChange={() => onSelect(option.value)}
            className="h-4 w-4 border-ink-300 accent-gold-500"
          />
          <span className="flex-1 text-ink-700">{option.label}</span>
          {counts?.[option.value] !== undefined && (
            <span className="text-xs text-ink-400">({counts[option.value]})</span>
          )}
        </label>
      ))}
      {current && !hideClear && (
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="mt-1 text-sm font-semibold text-gold-500 hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  );
}

function RangeInputs({
  minKey,
  maxKey,
  minPlaceholder,
  maxPlaceholder,
  prefix,
  onApply,
}: {
  minKey: string;
  maxKey: string;
  minPlaceholder: string;
  maxPlaceholder: string;
  prefix?: string;
  onApply: (key: string, value: string | null) => void;
}) {
  const params = useSearchParams();
  const appliedMin = params.get(minKey) ?? "";
  const appliedMax = params.get(maxKey) ?? "";

  const [min, setMin] = useState(appliedMin);
  const [max, setMax] = useState(appliedMax);
  const [applied, setApplied] = useState(`${appliedMin}|${appliedMax}`);
  if (applied !== `${appliedMin}|${appliedMax}`) {
    setApplied(`${appliedMin}|${appliedMax}`);
    setMin(appliedMin);
    setMax(appliedMax);
  }

  const commit = (key: string, value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    onApply(key, cleaned || null);
  };

  return (
    <div className="flex items-center gap-2">
      <Field
        value={min}
        prefix={prefix}
        placeholder={minPlaceholder}
        onChange={setMin}
        onCommit={(value) => commit(minKey, value)}
      />
      <span className="text-ink-400">–</span>
      <Field
        value={max}
        prefix={prefix}
        placeholder={maxPlaceholder}
        onChange={setMax}
        onCommit={(value) => commit(maxKey, value)}
      />
    </div>
  );
}

function Field({
  value,
  onChange,
  onCommit,
  placeholder,
  prefix,
}: {
  value: string;
  onChange: (value: string) => void;
  onCommit: (value: string) => void;
  placeholder: string;
  prefix?: string;
}) {
  return (
    <div className="relative flex-1">
      {prefix && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">
          {prefix}
        </span>
      )}
      <input
        type="number"
        inputMode="numeric"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onBlur={(event) => onCommit(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onCommit((event.target as HTMLInputElement).value);
          }
        }}
        className={`w-full rounded-lg border border-ink-300 bg-ink-50 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-gold-400 ${
          prefix ? "pl-7 pr-2" : "px-3"
        }`}
      />
    </div>
  );
}
