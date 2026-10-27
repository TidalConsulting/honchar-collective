"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { RANGE_OPTIONS, toDateInput, type Timeframe } from "@/lib/timeframe";

/**
 * Range picker for the metrics dashboard.
 *
 * The choice lives in the URL rather than component state, so a particular view
 * can be bookmarked or sent to someone — the same reason the public inventory
 * filters work that way.
 */
export function TimeframePicker({ timeframe }: { timeframe: Timeframe }) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const [customOpen, setCustomOpen] = useState(timeframe.key === "custom");

  const push = (next: URLSearchParams) => {
    startTransition(() => router.push(`/admin/metrics?${next.toString()}`, { scroll: false }));
  };

  const setRange = (key: string) => {
    const next = new URLSearchParams(params);
    next.set("range", key);
    if (key !== "custom") {
      next.delete("from");
      next.delete("to");
    }
    push(next);
  };

  const toggleCompare = () => {
    const next = new URLSearchParams(params);
    if (timeframe.compare) next.delete("compare");
    else next.set("compare", "1");
    push(next);
  };

  const applyCustom = (from: string, to: string) => {
    if (!from || !to) return;
    const next = new URLSearchParams(params);
    next.set("range", "custom");
    next.set("from", from);
    next.set("to", to);
    push(next);
  };

  const isCustom = timeframe.key === "custom";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-1.5">
        {RANGE_OPTIONS.map((option) => {
          const active = !isCustom && timeframe.key === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setRange(option.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "bg-gold-500 text-black"
                  : "border border-ink-300 bg-surface text-ink-700 hover:bg-ink-100"
              }`}
            >
              {option.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setCustomOpen((open) => !open)}
          aria-expanded={customOpen}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            isCustom
              ? "bg-gold-500 text-black"
              : "border border-ink-300 bg-surface text-ink-700 hover:bg-ink-100"
          }`}
        >
          {isCustom ? timeframe.label : "Custom"}
        </button>
      </div>

      <button
        type="button"
        onClick={toggleCompare}
        aria-pressed={timeframe.compare}
        className={`ml-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          timeframe.compare
            ? "bg-gold-500 text-white"
            : "border border-ink-300 bg-surface text-ink-700 hover:bg-ink-100"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
          <path d="M4 8h13l-3-3M20 16H7l3 3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Compare
      </button>

      {customOpen && (
        <CustomRange
          from={toDateInput(timeframe.current.from)}
          to={toDateInput(timeframe.current.to)}
          onApply={applyCustom}
        />
      )}
    </div>
  );
}

function CustomRange({
  from,
  to,
  onApply,
}: {
  from: string;
  to: string;
  onApply: (from: string, to: string) => void;
}) {
  const [start, setStart] = useState(from);
  const [end, setEnd] = useState(to);
  const today = toDateInput(new Date());

  return (
    <div className="flex w-full flex-wrap items-end gap-2 rounded-card border border-ink-200 bg-surface p-3">
      <label className="text-xs font-semibold text-ink-700">
        <span className="mb-1 block uppercase tracking-wider text-ink-500">From</span>
        <input
          type="date"
          value={start}
          max={end || today}
          onChange={(event) => setStart(event.target.value)}
          className="h-10 rounded-lg border border-ink-300 px-3 text-sm text-ink-900"
        />
      </label>
      <label className="text-xs font-semibold text-ink-700">
        <span className="mb-1 block uppercase tracking-wider text-ink-500">To</span>
        <input
          type="date"
          value={end}
          min={start}
          max={today}
          onChange={(event) => setEnd(event.target.value)}
          className="h-10 rounded-lg border border-ink-300 px-3 text-sm text-ink-900"
        />
      </label>
      <button
        type="button"
        onClick={() => onApply(start, end)}
        disabled={!start || !end || start > end}
        className="h-10 rounded-lg bg-gold-500 px-4 text-sm font-bold text-black hover:bg-gold-400 disabled:opacity-50"
      >
        Apply
      </button>
    </div>
  );
}
