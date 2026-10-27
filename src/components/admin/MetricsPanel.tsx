import { compare, type Delta } from "@/lib/delta";
import { METRIC_KEYS, type DashboardMetrics } from "@/lib/metrics";

/**
 * Nine numbers, no chart. None of these is a series over time — each is a single
 * current value — so a stat tile is the honest form. A metric with no data
 * shows a dash and says why, rather than a zero that reads like a real result.
 */
const LABEL: Record<(typeof METRIC_KEYS)[number], string> = {
  avgDaysOnMarket: "Avg. days on market",
  avgSaleVsList: "Avg. sold vs. asking",
  longestDaysOnMarket: "Longest listed",
  avgMargin: "Avg. margin",
  grossProfit: "Gross profit",
  totalLeads: "Form enquiries",
  whatsappTaps: "WhatsApp taps",
  visits: "Site visits",
  avgMinutesOnSite: "Avg. time on site",
};

const FORMAT: Record<(typeof METRIC_KEYS)[number], (value: number) => string> = {
  avgDaysOnMarket: (v) => v.toLocaleString(),
  avgSaleVsList: (v) => `${v}%`,
  longestDaysOnMarket: (v) => `${v.toLocaleString()} days`,
  avgMargin: (v) => `${v}%`,
  grossProfit: (v) => `$${v.toLocaleString()}`,
  totalLeads: (v) => v.toLocaleString(),
  whatsappTaps: (v) => v.toLocaleString(),
  visits: (v) => v.toLocaleString(),
  avgMinutesOnSite: (v) => `${v} min`,
};

export function MetricsPanel({
  metrics,
  previous = null,
  previousLabel,
}: {
  metrics: DashboardMetrics;
  /** The same figures over the preceding stretch, when comparing. */
  previous?: DashboardMetrics | null;
  previousLabel?: string;
}) {
  const tiles = METRIC_KEYS.map((key) => ({
    label: LABEL[key],
    metric: metrics[key],
    format: FORMAT[key],
    delta: previous ? compare(metrics[key], previous[key]) : null,
    previousValue: previous ? previous[key].value : null,
  }));

  return (
    <section className="mb-8">
      <dl className="grid gap-px overflow-hidden rounded-card border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <div key={tile.label} className="bg-surface px-5 py-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              {tile.label}
            </dt>
            <dd className="mt-1.5 flex items-baseline gap-2">
              {tile.metric.value === null ? (
                <span className="text-3xl font-extrabold tracking-tight text-ink-400">—</span>
              ) : (
                <span className="text-3xl font-extrabold tracking-tight text-ink-900 tabular-nums">
                  {tile.format(tile.metric.value)}
                </span>
              )}
            </dd>
            <p className="mt-1 text-xs text-ink-500">
              {tile.metric.detail ?? tile.metric.basis}
            </p>
            {previous && (
              <DeltaLine
                delta={tile.delta}
                previousValue={tile.previousValue}
                format={tile.format}
                label={previousLabel}
                pointInTime={tile.metric.pointInTime}
              />
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}

/**
 * The comparison line under a tile.
 *
 * Colour follows whether the move is *good*, not whether it went up — days on
 * market falling is a win, visits falling is not, and an arrow coloured purely
 * by direction would say the opposite half the time.
 */
function DeltaLine({
  delta,
  previousValue,
  format,
  label,
  pointInTime,
}: {
  delta: Delta | null;
  previousValue: number | null;
  format: (value: number) => string;
  label?: string;
  pointInTime?: boolean;
}) {
  if (pointInTime) {
    return (
      <p className="mt-2 text-xs text-ink-400">Current figure — not tied to a period</p>
    );
  }
  if (!delta) return null;

  const tone =
    delta.good === null
      ? "text-ink-500"
      : delta.good
        ? "text-emerald-400"
        : "text-red-400";

  const arrow = delta.direction === "flat" ? "" : delta.direction === "up" ? "▲" : "▼";

  return (
    <p className={`mt-2 text-xs font-semibold ${tone}`}>
      {arrow && <span className="mr-1">{arrow}</span>}
      {delta.percent !== null && delta.direction !== "flat"
        ? `${Math.abs(delta.percent)}%`
        : delta.note}
      {previousValue !== null && (
        <span className="ml-1.5 font-normal text-ink-500">
          vs {format(previousValue)}
          {label ? ` ${label}` : ""}
        </span>
      )}
    </p>
  );
}
