import Link from "next/link";
import { Suspense } from "react";

import { MetricsPanel } from "@/components/admin/MetricsPanel";
import { TimeframePicker } from "@/components/admin/TimeframePicker";
import { formatPrice } from "@/lib/format";
import { getAudienceMetrics, type SourceRow, type ItemViewRow } from "@/lib/audience";
import { getDashboardMetrics } from "@/lib/metrics";
import { parseTimeframe, previousLabel } from "@/lib/timeframe";

export const metadata = { title: "Metrics" };
export const dynamic = "force-dynamic";

export default async function MetricsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const timeframe = parseTimeframe(await searchParams);

  const [metrics, audience, previousMetrics, previousAudience] = await Promise.all([
    getDashboardMetrics(timeframe.current),
    getAudienceMetrics(timeframe.current),
    timeframe.compare ? getDashboardMetrics(timeframe.previous) : Promise.resolve(null),
    timeframe.compare ? getAudienceMetrics(timeframe.previous) : Promise.resolve(null),
  ]);

  const against = previousLabel(timeframe);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">Metrics</h1>
        <p className="mt-1 text-ink-600">
          How the shop is performing, and where the people looking at it come from.{" "}
          {timeframe.key === "custom"
            ? `Showing ${timeframe.label}.`
            : `Showing the ${timeframe.label.replace(/^Last /, "last ")}.`}
          {timeframe.compare && ` Compared with ${against}.`}
        </p>
      </div>

      <div className="mb-6">
        <Suspense fallback={null}>
          <TimeframePicker timeframe={timeframe} />
        </Suspense>
      </div>

      <MetricsPanel
        metrics={metrics}
        previous={previousMetrics}
        previousLabel={against}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SourcesCard
          rows={audience.sources}
          totalVisits={audience.totalVisits}
          previous={previousAudience?.sources ?? null}
          against={against}
        />
        <ItemsCard rows={audience.items} />
      </div>
    </div>
  );
}

function SourcesCard({
  rows,
  totalVisits,
  previous,
  against,
}: {
  rows: SourceRow[];
  totalVisits: number;
  previous: SourceRow[] | null;
  against: string;
}) {
  const before = new Map((previous ?? []).map((row) => [row.source, row.visits]));
  return (
    <section className="rounded-card border border-ink-200 bg-surface">
      <header className="border-b border-ink-200 px-5 py-4">
        <h2 className="text-lg font-bold text-ink-900">Where visitors came from</h2>
        <p className="mt-0.5 text-sm text-ink-600">
          {totalVisits > 0
            ? `${totalVisits.toLocaleString()} ${totalVisits === 1 ? "visit" : "visits"}. One visit is one person's session, however many pages they read.`
            : "Nothing recorded yet."}
        </p>
      </header>

      {rows.length === 0 ? (
        <Empty>
          Traffic sources appear here once people start arriving. Anyone who types the address
          in directly, or follows a link with no referrer, shows as “Direct”.
        </Empty>
      ) : (
        <ul className="divide-y divide-ink-200">
          {rows.map((row) => (
            <li key={row.source} className="px-5 py-3.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-sm font-bold text-ink-900">{row.source}</span>
                <span className="shrink-0 text-sm font-bold text-ink-900">
                  {row.visits.toLocaleString()}
                  <span className="ml-1.5 font-semibold text-ink-500">{row.share}%</span>
                </span>
              </div>
              {/* A share bar rather than a pie: these are parts of one whole and
                  the eye compares lengths far better than angles. */}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                <div
                  className="h-full rounded-full bg-gold-500"
                  style={{ width: `${Math.max(row.share, 2)}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-ink-500">
                {row.views.toLocaleString()} page {row.views === 1 ? "view" : "views"}
                {row.avgMinutes !== null && ` · ${row.avgMinutes} min average`}
              </p>
              {previous && <SourceDelta now={row.visits} then={before.get(row.source)} against={against} />}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ItemsCard({ rows }: { rows: ItemViewRow[] }) {
  return (
    <section className="rounded-card border border-ink-200 bg-surface">
      <header className="border-b border-ink-200 px-5 py-4">
        <h2 className="text-lg font-bold text-ink-900">Which pieces got looked at</h2>
        <p className="mt-0.5 text-sm text-ink-600">
          Ranked by views. Time is how long the average person spent on that listing.
        </p>
      </header>

      {rows.length === 0 ? (
        <Empty>
          Once shoppers start opening listings, this ranks them by views and shows how long
          people stayed on each one.
        </Empty>
      ) : (
        <ul className="divide-y divide-ink-200">
          {rows.slice(0, 12).map((row) => (
            <li key={row.id} className="flex items-center gap-4 px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/shop/${row.slug}`}
                  target="_blank"
                  className="block truncate text-sm font-bold text-ink-900 hover:text-gold-500"
                >
                  {row.title}
                </Link>
                <p className="mt-0.5 truncate text-xs text-ink-500">
                  {formatPrice(row.price)}
                  {row.status === "SOLD" && " · Sold"}
                  {row.leads > 0 &&
                    ` · ${row.leads} ${row.leads === 1 ? "enquiry" : "enquiries"}`}
                  {row.whatsapp > 0 && ` · ${row.whatsapp} WhatsApp`}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-ink-900">{row.views.toLocaleString()}</p>
                <p className="text-xs text-ink-500">
                  {row.avgSeconds !== null ? formatDuration(row.avgSeconds) : "—"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-5 py-10 text-center text-sm text-ink-500">{children}</p>;
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
}

/**
 * Visits from one channel against the previous stretch. More is better for
 * every channel, so unlike the tiles there's no direction to get wrong.
 */
function SourceDelta({
  now,
  then,
  against,
}: {
  now: number;
  then: number | undefined;
  against: string;
}) {
  if (then === undefined) {
    return <p className="mt-1 text-xs font-semibold text-emerald-400">New — none from here {against}</p>;
  }
  if (then === now) {
    return <p className="mt-1 text-xs text-ink-500">No change on {against}</p>;
  }

  const up = now > then;
  const percent = then === 0 ? null : Math.round(((now - then) / then) * 100);

  return (
    <p className={`mt-1 text-xs font-semibold ${up ? "text-emerald-400" : "text-red-400"}`}>
      {up ? "▲" : "▼"} {percent === null ? "up from none" : `${Math.abs(percent)}%`}
      <span className="ml-1.5 font-normal text-ink-500">
        vs {then.toLocaleString()} {against}
      </span>
    </p>
  );
}
