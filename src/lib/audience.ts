import "server-only";

import { prisma } from "@/lib/prisma";
import { itemTitle } from "@/lib/format";
import type { Period } from "@/lib/timeframe";

/**
 * The audience half of the dashboard: where visitors came from and which
 * pieces held their attention.
 *
 * Every figure here is built from the same page-view rows the visit counter
 * already writes. Nothing identifies a person — a session id that dies with
 * the browser tab, a channel name, and a duration.
 */

export type SourceRow = {
  source: string;
  visits: number;
  views: number;
  /** Share of visits in the window, 0–100. */
  share: number;
  avgMinutes: number | null;
  leads: number | null;
};

export type ItemViewRow = {
  id: string;
  title: string;
  slug: string;
  price: number;
  status: string;
  views: number;
  visitors: number;
  avgSeconds: number | null;
  leads: number;
  whatsapp: number;
};

export type AudienceMetrics = {
  sources: SourceRow[];
  items: ItemViewRow[];
  totalVisits: number;
};

export async function getAudienceMetrics(period: Period): Promise<AudienceMetrics> {
  const within = { gte: period.from, lte: period.to };

  const [views, items, leadsByItem, tapsByItem] = await Promise.all([
    prisma.pageView.findMany({
      where: { createdAt: within },
      select: { sessionId: true, dwellMs: true, source: true, itemId: true },
    }),
    prisma.item.findMany({
      select: { id: true, slug: true, brand: true, name: true, price: true, status: true },
    }),
    prisma.lead.groupBy({
      by: ["itemId"],
      where: { createdAt: within, itemId: { not: null } },
      _count: { _all: true },
    }),
    prisma.contactTap.groupBy({
      by: ["itemId"],
      where: { createdAt: within, itemId: { not: null }, channel: "whatsapp" },
      _count: { _all: true },
    }),
  ]);

  // --- Traffic sources ------------------------------------------------------
  // A visit is a session, not a page view: one person reading four listings is
  // one visit from Facebook, not four.
  const bySource = new Map<string, { sessions: Map<string, number>; views: number }>();

  for (const view of views) {
    const source = view.source ?? "Direct";
    let bucket = bySource.get(source);
    if (!bucket) {
      bucket = { sessions: new Map(), views: 0 };
      bySource.set(source, bucket);
    }
    bucket.views += 1;
    bucket.sessions.set(view.sessionId, (bucket.sessions.get(view.sessionId) ?? 0) + view.dwellMs);
  }

  const totalVisits = new Set(views.map((view) => view.sessionId)).size;

  const sources: SourceRow[] = [...bySource.entries()]
    .map(([source, bucket]) => {
      const timed = [...bucket.sessions.values()].filter((ms) => ms > 0);
      return {
        source,
        visits: bucket.sessions.size,
        views: bucket.views,
        share: totalVisits ? Math.round((bucket.sessions.size / totalVisits) * 100) : 0,
        avgMinutes: timed.length
          ? Math.round((timed.reduce((sum, ms) => sum + ms, 0) / timed.length / 60000) * 10) / 10
          : null,
        leads: null,
      };
    })
    .sort((a, b) => b.visits - a.visits || a.source.localeCompare(b.source));

  // --- Per-item engagement ----------------------------------------------
  const byItem = new Map<string, { views: number; visitors: Set<string>; dwell: number[] }>();

  for (const view of views) {
    if (!view.itemId) continue;
    let bucket = byItem.get(view.itemId);
    if (!bucket) {
      bucket = { views: 0, visitors: new Set(), dwell: [] };
      byItem.set(view.itemId, bucket);
    }
    bucket.views += 1;
    bucket.visitors.add(view.sessionId);
    if (view.dwellMs > 0) bucket.dwell.push(view.dwellMs);
  }

  const leadCounts = new Map(
    leadsByItem.map((row) => [row.itemId as string, row._count._all]),
  );
  const tapCounts = new Map(
    tapsByItem.map((row) => [row.itemId as string, row._count._all]),
  );
  const itemById = new Map(items.map((item) => [item.id, item]));

  const itemRows: ItemViewRow[] = [...byItem.entries()]
    .flatMap(([id, bucket]) => {
      const item = itemById.get(id);
      if (!item) return [];
      return [
        {
          id,
          title: itemTitle(item),
          slug: item.slug,
          price: item.price,
          status: item.status,
          views: bucket.views,
          visitors: bucket.visitors.size,
          avgSeconds: bucket.dwell.length
            ? Math.round(bucket.dwell.reduce((sum, ms) => sum + ms, 0) / bucket.dwell.length / 1000)
            : null,
          leads: leadCounts.get(id) ?? 0,
          whatsapp: tapCounts.get(id) ?? 0,
        },
      ];
    })
    .sort((a, b) => b.views - a.views || b.visitors - a.visitors);

  return { sources, items: itemRows, totalVisits };
}
