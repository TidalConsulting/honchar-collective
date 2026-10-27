/**
 * Layaway (apartado) defaults. A shopper puts a deposit down to hold a piece,
 * pays the balance in equal instalments, and takes it home with the last one.
 * No interest, no credit check — the piece simply waits in the showroom.
 */
export const LAYAWAY_DEFAULTS = {
  depositPercent: 30,
  payments: 4,
  /** Days between instalments. */
  intervalDays: 14,
} as const;

export const PAYMENT_OPTIONS = [2, 3, 4, 6, 8] as const;
export const INTERVAL_OPTIONS = [
  { days: 7, label: "Weekly" },
  { days: 14, label: "Every 2 weeks" },
  { days: 30, label: "Monthly" },
] as const;

/** Layaway is offered on pieces from this price up. */
export const LAYAWAY_MIN_PRICE = 300;

/** Equal instalments after the deposit, rounded up so the plan never reads low. */
export function layawayInstalment({
  price,
  deposit,
  payments,
}: {
  price: number;
  deposit: number;
  payments: number;
}) {
  const balance = Math.max(price - deposit, 0);
  if (balance === 0 || payments <= 0) return 0;
  return Math.ceil(balance / payments);
}

/** The "or $340 every 2 weeks" figure shown on listing cards. */
export function estimatedInstalment(price: number) {
  if (price < LAYAWAY_MIN_PRICE) return null;
  return layawayInstalment({
    price,
    deposit: Math.round((price * LAYAWAY_DEFAULTS.depositPercent) / 100),
    payments: LAYAWAY_DEFAULTS.payments,
  });
}
