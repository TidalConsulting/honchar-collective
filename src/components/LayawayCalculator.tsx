"use client";

import { useMemo, useState } from "react";

import {
  INTERVAL_OPTIONS,
  LAYAWAY_DEFAULTS,
  PAYMENT_OPTIONS,
  layawayInstalment,
} from "@/lib/finance";
import { formatDop, formatPrice, formatShortDate } from "@/lib/format";

const MAX_PRICE = 100_000;
const DEPOSIT_STEPS = [20, 30, 40, 50] as const;

export function LayawayCalculator({
  price: initialPrice,
  editablePrice = false,
}: {
  price: number;
  /**
   * Lets the shopper type in their own price. On an item's own page the price
   * is that item's, so this stays off; on the standalone layaway page there
   * is no item, so the price has to be theirs to set.
   */
  editablePrice?: boolean;
}) {
  const [price, setPrice] = useState(initialPrice);
  const [depositPercent, setDepositPercent] = useState<number>(LAYAWAY_DEFAULTS.depositPercent);
  const [payments, setPayments] = useState<number>(LAYAWAY_DEFAULTS.payments);
  const [interval, setIntervalDays] = useState<number>(LAYAWAY_DEFAULTS.intervalDays);

  const deposit = Math.round((price * depositPercent) / 100);
  const instalment = useMemo(
    () => layawayInstalment({ price, deposit, payments }),
    [price, deposit, payments],
  );

  // The dates the schedule would fall on if the deposit went down today.
  // Computed on render, not stored: it's an illustration, not a contract.
  const schedule = Array.from({ length: payments }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + interval * (index + 1));
    return date;
  });
  const lastPayment = schedule[schedule.length - 1];

  return (
    <div className="rounded-card border border-ink-200 bg-surface p-5">
      <h3 className="font-serif text-xl text-ink-900">Layaway plan</h3>
      <p className="mt-1 text-sm text-ink-600">
        {editablePrice
          ? "Put in a price and see how a layaway plan would work. No interest, no credit check."
          : "Hold this piece with a deposit and pay the rest over time. No interest, no credit check."}
      </p>

      {editablePrice && (
        <label className="mt-5 block">
          <span className="mb-1 block text-sm font-semibold text-ink-800">Item price (USD)</span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
              $
            </span>
            <input
              id="layaway-price"
              type="number"
              inputMode="numeric"
              min={0}
              max={MAX_PRICE}
              step={50}
              value={price === 0 ? "" : price}
              onChange={(event) => {
                const next = Number(event.target.value.replace(/[^0-9]/g, ""));
                setPrice(Math.min(Number.isFinite(next) ? next : 0, MAX_PRICE));
              }}
              className="w-full rounded-lg border border-ink-300 bg-ink-50 py-2.5 pl-7 pr-3 text-lg font-semibold text-ink-900 focus:border-gold-400"
            />
          </div>
        </label>
      )}

      <div className="mt-5 rounded-lg border border-gold-500/40 bg-black px-5 py-4 text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-gold-400">
          {payments} payments of
        </p>
        <p className="mt-1 font-serif text-4xl text-ink-900 tabular-nums">
          ${instalment.toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-ink-500 tabular-nums">
          after a {formatPrice(deposit)} deposit · {formatDop(instalment)} each
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <Choice
          label="Deposit today"
          options={DEPOSIT_STEPS.map((value) => ({ value, label: `${value}%` }))}
          value={depositPercent}
          onChange={setDepositPercent}
        />
        <Choice
          label="Number of payments"
          options={PAYMENT_OPTIONS.map((value) => ({ value, label: String(value) }))}
          value={payments}
          onChange={setPayments}
        />
        <Choice
          label="How often"
          options={INTERVAL_OPTIONS.map((option) => ({ value: option.days, label: option.label }))}
          value={interval}
          onChange={setIntervalDays}
        />
      </div>

      {lastPayment && price > 0 && (
        <p className="mt-5 text-sm text-ink-600">
          Start today and the piece is yours on{" "}
          <span className="font-semibold text-ink-900">{formatShortDate(lastPayment)}</span>.
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-ink-500">
        The piece stays in our showroom, insured, until the final payment. Deposits are
        non-refundable after 7 days but can be moved to another piece. Peso amounts are approximate.
      </p>
    </div>
  );
}

function Choice({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: number; label: string }[];
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <span className="mb-2 block text-sm font-semibold text-ink-800">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={option.value === value}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              option.value === value
                ? "border-gold-500 bg-gold-500 text-black"
                : "border-ink-300 text-ink-700 hover:border-gold-500"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
