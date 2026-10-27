/**
 * The time window a dashboard figure covers, and the window it's compared to.
 *
 * Held in the URL so a view can be shared, bookmarked, and reloaded — the same
 * approach the public inventory filters use.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export const RANGE_KEYS = ["day", "week", "month", "quarter", "custom"] as const;
export type RangeKey = (typeof RANGE_KEYS)[number];

export const RANGE_OPTIONS: { key: Exclude<RangeKey, "custom">; label: string; days: number }[] = [
  { key: "day", label: "Last day", days: 1 },
  { key: "week", label: "Last week", days: 7 },
  { key: "month", label: "Last month", days: 30 },
  { key: "quarter", label: "Last quarter", days: 90 },
];

export type Period = { from: Date; to: Date };

export type Timeframe = {
  key: RangeKey;
  label: string;
  current: Period;
  /** The equally long stretch ending where the current one begins. */
  previous: Period;
  compare: boolean;
  /** Length in days, used for wording like "the 7 days before that". */
  days: number;
};

function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function one(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

/** yyyy-mm-dd in local time, for round-tripping through the URL and date inputs. */
export function toDateInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseTimeframe(
  params: Record<string, string | string[] | undefined>,
): Timeframe {
  const compare = one(params, "compare") === "1";
  const rawKey = one(params, "range");
  const key: RangeKey = RANGE_KEYS.includes(rawKey as RangeKey) ? (rawKey as RangeKey) : "month";

  const now = new Date();

  if (key === "custom") {
    const from = parseDate(one(params, "from"));
    const rawTo = parseDate(one(params, "to"));
    // The "to" date is inclusive to a person picking it, so run to its end.
    const to = rawTo ? new Date(rawTo.getTime() + DAY_MS - 1) : now;

    if (from && to > from) {
      const span = to.getTime() - from.getTime();
      return {
        key,
        label: `${toDateInput(from)} to ${toDateInput(new Date(to.getTime() - DAY_MS + 1))}`,
        current: { from, to },
        previous: { from: new Date(from.getTime() - span), to: from },
        compare,
        days: Math.max(Math.round(span / DAY_MS), 1),
      };
    }
    // An incomplete custom range falls back rather than showing nothing.
  }

  const option =
    RANGE_OPTIONS.find((entry) => entry.key === key) ??
    RANGE_OPTIONS.find((entry) => entry.key === "month")!;

  const from = new Date(now.getTime() - option.days * DAY_MS);
  return {
    key: key === "custom" ? "month" : key,
    label: option.label,
    current: { from, to: now },
    previous: { from: new Date(from.getTime() - option.days * DAY_MS), to: from },
    compare,
    days: option.days,
  };
}

/** How the previous window is described under a comparison. */
export function previousLabel(timeframe: Timeframe): string {
  switch (timeframe.key) {
    case "day":
      return "the day before";
    case "week":
      return "the week before";
    case "month":
      return "the 30 days before";
    case "quarter":
      return "the quarter before";
    default:
      return `the ${timeframe.days} days before`;
  }
}

export function timeframeQuery(timeframe: Partial<Timeframe> & { key: RangeKey; compare: boolean }, extra?: Record<string, string>) {
  const params = new URLSearchParams();
  params.set("range", timeframe.key);
  if (timeframe.compare) params.set("compare", "1");
  for (const [key, value] of Object.entries(extra ?? {})) params.set(key, value);
  return `?${params.toString()}`;
}
