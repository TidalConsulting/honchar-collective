import "server-only";

import { prisma } from "@/lib/prisma";
import type { Period } from "@/lib/timeframe";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * A metric that has no data yet reports `value: null` rather than 0 — "no sales
 * yet" and "sold at 0% of list" are very different things, and a dashboard that
 * confuses them is worse than one that admits the gap.
 */
export type Metric = {
  value: number | null;
  /** Where the number came from, e.g. "across 4 sold items". */
  basis: string;
  /** Extra context, e.g. which piece has been sitting longest. */
  detail?: string;
  /**
   * Which way is good news. Days on market falling is an improvement; visits
   * falling is not. Without this a comparison colours half its arrows wrong.
   */
  betterWhen: "higher" | "lower";
  /**
   * True for a figure that describes right now rather than a stretch of time.
   * These are left out of comparisons: "the longest-listed piece, but last
   * week" isn't a number that means anything.
   */
  pointInTime?: boolean;
};

export type DashboardMetrics = {
  avgDaysOnMarket: Metric;
  avgSaleVsList: Metric;
  longestDaysOnMarket: Metric;
  avgMargin: Metric;
  grossProfit: Metric;
  totalLeads: Metric;
  whatsappTaps: Metric;
  visits: Metric;
  avgMinutesOnSite: Metric;
};

export const METRIC_KEYS = [
  "avgDaysOnMarket",
  "avgSaleVsList",
  "longestDaysOnMarket",
  "avgMargin",
  "grossProfit",
  "totalLeads",
  "whatsappTaps",
  "visits",
  "avgMinutesOnSite",
] as const;

const plural = (count: number, one: string, many = `${one}s`) =>
  `${count} ${count === 1 ? one : many}`;

export async function getDashboardMetrics(period: Period): Promise<DashboardMetrics> {
  const within = { gte: period.from, lte: period.to };

  const [sold, live, leadCount, views, taps] = await Promise.all([
    // Sales are attributed to the period they closed in, so "last week" means
    // the pieces that sold last week rather than everything ever sold.
    prisma.item.findMany({
      where: { status: "SOLD", soldAt: within, listedAt: { not: null } },
      select: {
        listedAt: true,
        soldAt: true,
        soldPrice: true,
        originalPrice: true,
        price: true,
        costPrice: true,
        importCost: true,
      },
    }),
    prisma.item.findMany({
      where: { status: "PUBLISHED", listedAt: { not: null } },
      orderBy: { listedAt: "asc" },
      take: 1,
      select: { listedAt: true, brand: true, name: true },
    }),
    prisma.lead.count({ where: { createdAt: within } }),
    prisma.pageView.findMany({
      where: { createdAt: within },
      select: { sessionId: true, dwellMs: true },
    }),
    prisma.contactTap.count({ where: { createdAt: within, channel: "whatsapp" } }),
  ]);

  // --- Days on market -------------------------------------------------------
  const daysToSell = sold
    .map((v) => (v.soldAt!.getTime() - v.listedAt!.getTime()) / DAY_MS)
    .filter((days) => days >= 0);

  const avgDaysOnMarket: Metric = daysToSell.length
    ? {
        value: Math.round(daysToSell.reduce((sum, d) => sum + d, 0) / daysToSell.length),
        basis: `across ${plural(daysToSell.length, "sold item")}`,
        betterWhen: "lower",
      }
    : { value: null, basis: "no sales in this period", betterWhen: "lower" };

  // --- Sale price as a share of the original asking price -------------------
  // Falls back to the current price when an item predates originalPrice being
  // recorded, so older stock still contributes something meaningful.
  const ratios = sold
    .map((v) => {
      const list = v.originalPrice ?? v.price;
      return v.soldPrice && list > 0 ? (v.soldPrice / list) * 100 : null;
    })
    .filter((r): r is number => r !== null);

  const avgSaleVsList: Metric = ratios.length
    ? {
        value: Math.round((ratios.reduce((sum, r) => sum + r, 0) / ratios.length) * 10) / 10,
        basis: `across ${plural(ratios.length, "sale")} with a recorded price`,
        betterWhen: "higher",
      }
    : { value: null, basis: "no sale prices in this period", betterWhen: "higher" };

  // --- Longest currently listed ----------------------------------------
  // Deliberately not filtered by the period: this is the state of the shop right
  // now, which is the only reading of it that makes sense.
  const oldest = live[0];
  const longestDaysOnMarket: Metric = oldest?.listedAt
    ? {
        value: Math.floor((Date.now() - oldest.listedAt.getTime()) / DAY_MS),
        basis: "longest-listed item still live",
        detail: `${oldest.brand} ${oldest.name}`,
        betterWhen: "lower",
        pointInTime: true,
      }
    : { value: null, basis: "nothing published yet", betterWhen: "lower", pointInTime: true };

  // --- Margin --------------------------------------------------------------
  // Landed cost is what was paid in the US plus what it took to get the piece
  // into the country. Only sales with a recorded sale price and a recorded
  // purchase price count: guessing either would make the margin fiction.
  const costed = sold.filter(
    (v): v is typeof v & { soldPrice: number; costPrice: number } =>
      v.soldPrice !== null && v.soldPrice > 0 && v.costPrice !== null,
  );
  const profits = costed.map((v) => v.soldPrice - v.costPrice - (v.importCost ?? 0));

  const avgMargin: Metric = costed.length
    ? {
        value:
          Math.round(
            (profits.reduce((sum, p) => sum + p, 0) /
              costed.reduce((sum, v) => sum + v.soldPrice, 0)) *
              1000,
          ) / 10,
        basis: `across ${plural(costed.length, "sale")} with costs recorded`,
        betterWhen: "higher",
      }
    : { value: null, basis: "record a cost on sold pieces to see this", betterWhen: "higher" };

  const grossProfit: Metric = costed.length
    ? {
        value: profits.reduce((sum, p) => sum + p, 0),
        basis: `sale price minus landed cost, ${plural(costed.length, "sale")}`,
        betterWhen: "higher",
      }
    : { value: null, basis: "no costed sales in this period", betterWhen: "higher" };

  // --- Leads ----------------------------------------------------------------
  const totalLeads: Metric = {
    value: leadCount,
    basis: leadCount === 0 ? "none in this period" : "in this period",
    betterWhen: "higher",
  };

  // --- WhatsApp -------------------------------------------------------------
  // Taps, not conversations: the dashboard can see someone open WhatsApp, not
  // whether they pressed send. Still the best signal of interest in a market
  // where almost nobody fills in a form.
  const whatsappTaps: Metric = {
    value: taps,
    basis: taps === 0 ? "none in this period" : "taps on a WhatsApp button",
    betterWhen: "higher",
  };

  // --- Visits and time on site ---------------------------------------------
  const perSession = new Map<string, number>();
  for (const view of views) {
    perSession.set(view.sessionId, (perSession.get(view.sessionId) ?? 0) + view.dwellMs);
  }

  const visits: Metric = perSession.size
    ? {
        value: perSession.size,
        basis: `${plural(views.length, "page view")}`,
        betterWhen: "higher",
      }
    : { value: null, basis: "no visits in this period", betterWhen: "higher" };

  // Only sessions that reported a dwell time count, so sessions cut short by a
  // browser that never fired the beacon don't drag the average toward zero.
  const timed = [...perSession.values()].filter((ms) => ms > 0);
  const avgMinutesOnSite: Metric = timed.length
    ? {
        value: Math.round((timed.reduce((sum, ms) => sum + ms, 0) / timed.length / 60000) * 10) / 10,
        basis: `across ${plural(timed.length, "visit")}`,
        betterWhen: "higher",
      }
    : { value: null, basis: "not enough visits yet", betterWhen: "higher" };

  return {
    avgDaysOnMarket,
    avgSaleVsList,
    longestDaysOnMarket,
    avgMargin,
    grossProfit,
    totalLeads,
    whatsappTaps,
    visits,
    avgMinutesOnSite,
  };
}
