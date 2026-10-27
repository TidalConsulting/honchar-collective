import type { Metric } from "@/lib/metrics";

/**
 * The change between a figure and the same figure over the preceding period.
 */
export type Delta = {
  /** Percent change, rounded. Null when there's nothing meaningful to compare. */
  percent: number | null;
  /** Raw difference, for figures where the absolute move reads better. */
  absolute: number | null;
  direction: "up" | "down" | "flat";
  /** Whether the move is good news, given the metric's own direction. */
  good: boolean | null;
  /** Said plainly when a percentage would mislead. */
  note?: string;
};

export function compare(current: Metric, previous: Metric | null): Delta | null {
  // A snapshot of right now has no earlier counterpart to sit beside.
  if (current.pointInTime) return null;
  if (!previous) return null;

  const now = current.value;
  const before = previous.value;

  if (now === null && before === null) return null;

  if (before === null) {
    return {
      percent: null,
      absolute: null,
      direction: "up",
      good: null,
      note: "no data in the previous period",
    };
  }

  if (now === null) {
    return {
      percent: null,
      absolute: null,
      direction: "down",
      good: null,
      note: "no data in this period",
    };
  }

  const absolute = Math.round((now - before) * 10) / 10;

  if (absolute === 0) {
    return { percent: 0, absolute: 0, direction: "flat", good: null, note: "no change" };
  }

  // Going from zero to something is real movement, but "+∞%" is not a number
  // anyone can act on — say it in words instead.
  if (before === 0) {
    return {
      percent: null,
      absolute,
      direction: absolute > 0 ? "up" : "down",
      good: current.betterWhen === "higher" ? absolute > 0 : absolute < 0,
      note: "up from none",
    };
  }

  const percent = Math.round((absolute / Math.abs(before)) * 100);
  const direction = absolute > 0 ? "up" : "down";

  return {
    percent,
    absolute,
    direction,
    good: current.betterWhen === "higher" ? absolute > 0 : absolute < 0,
  };
}
