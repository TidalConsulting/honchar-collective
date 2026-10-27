import Link from "next/link";

import { AdminInventoryTable } from "@/components/admin/AdminInventoryTable";
import { FlashMessage } from "@/components/admin/FlashMessage";
import { daysAgo, formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "PUBLISHED", label: "Live" },
  { value: "DRAFT", label: "Drafts" },
  { value: "SOLD", label: "Sold" },
] as const;

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const statusParam = typeof params.status === "string" ? params.status : "all";
  const query = (typeof params.q === "string" ? params.q : "").trim();

  const where = {
    ...(statusParam !== "all" && ["PUBLISHED", "DRAFT", "SOLD"].includes(statusParam)
      ? { status: statusParam as "PUBLISHED" | "DRAFT" | "SOLD" }
      : {}),
    ...(query
      ? {
          OR: [
            { brand: { contains: query, mode: "insensitive" as const } },
            { name: { contains: query, mode: "insensitive" as const } },
            { sku: { contains: query, mode: "insensitive" as const } },
            { serialNumber: { contains: query, mode: "insensitive" as const } },
            { category: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const since = daysAgo(30);

  const [rows, counts, stock, views, taps] = await Promise.all([
    prisma.item.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 200,
      select: {
        id: true,
        slug: true,
        brand: true,
        name: true,
        category: true,
        color: true,
        price: true,
        status: true,
        featured: true,
        sku: true,
        arrival: true,
        arrivesAt: true,
        listedAt: true,
        costPrice: true,
        importCost: true,
        updatedAt: true,
        images: { orderBy: { position: "asc" }, take: 1, select: { url: true } },
        _count: { select: { leads: true } },
      },
    }),
    prisma.item.groupBy({ by: ["status"], _count: { _all: true } }),
    // The stock summary is always the whole live collection, whatever tab or
    // search is showing — it answers "what's sitting in the shop right now".
    prisma.item.findMany({
      where: { status: "PUBLISHED" },
      select: { price: true, costPrice: true, importCost: true, arrival: true },
    }),
    prisma.pageView.groupBy({
      by: ["itemId"],
      where: { createdAt: { gte: since }, itemId: { not: null } },
      _count: { _all: true },
    }),
    prisma.contactTap.groupBy({
      by: ["itemId"],
      where: { createdAt: { gte: since }, itemId: { not: null }, channel: "whatsapp" },
      _count: { _all: true },
    }),
  ]);

  const viewsFor = new Map(views.map((row) => [row.itemId as string, row._count._all]));
  const tapsFor = new Map(taps.map((row) => [row.itemId as string, row._count._all]));
  const items = rows.map((row) => ({
    ...row,
    views30: viewsFor.get(row.id) ?? 0,
    whatsapp30: tapsFor.get(row.id) ?? 0,
  }));

  const retailValue = stock.reduce((sum, row) => sum + row.price, 0);
  const costed = stock.filter((row) => row.costPrice !== null);
  const landedValue = costed.reduce(
    (sum, row) => sum + (row.costPrice ?? 0) + (row.importCost ?? 0),
    0,
  );
  const costedRetail = costed.reduce((sum, row) => sum + row.price, 0);
  const inTransit = stock.filter((row) => row.arrival === "IN_TRANSIT").length;

  const countFor = (status: string) =>
    status === "all"
      ? counts.reduce((sum, row) => sum + row._count._all, 0)
      : (counts.find((row) => row.status === status)?._count._all ?? 0);

  return (
    <div>
      <FlashMessage />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink-900 sm:text-4xl">Inventory</h1>
          <p className="mt-1 text-ink-600">
            Every piece, where it is, and how much interest it&apos;s getting.
          </p>
        </div>
        <Link
          href="/admin/items/new"
          className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-gold-400"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          Add a piece
        </Link>
      </div>

      <dl className="mt-6 grid gap-px overflow-hidden rounded-card border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Live pieces",
            value: countFor("PUBLISHED").toLocaleString(),
            note: `${inTransit} still in transit from the US`,
          },
          {
            label: "Stock at asking price",
            value: formatPrice(retailValue),
            note: "everything live, at today's prices",
          },
          {
            label: "Landed cost of stock",
            value: costed.length ? formatPrice(landedValue) : "—",
            note: costed.length
              ? `${costed.length} of ${stock.length} pieces have a cost recorded`
              : "add purchase prices to see this",
          },
          {
            label: "Potential profit",
            value: costed.length ? formatPrice(costedRetail - landedValue) : "—",
            note: costed.length
              ? `${Math.round(((costedRetail - landedValue) / Math.max(costedRetail, 1)) * 100)}% margin if it all sells at asking`
              : "on pieces with a cost recorded",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface px-5 py-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">{stat.label}</dt>
            <dd className="mt-1.5 text-2xl font-bold tracking-tight text-ink-900 tabular-nums">
              {stat.value}
            </dd>
            <p className="mt-1 text-xs text-ink-500">{stat.note}</p>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map((tab) => {
            const active = statusParam === tab.value;
            const href =
              tab.value === "all"
                ? `/admin${query ? `?q=${encodeURIComponent(query)}` : ""}`
                : `/admin?status=${tab.value}${query ? `&q=${encodeURIComponent(query)}` : ""}`;
            return (
              <Link
                key={tab.value}
                href={href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-gold-500 text-black"
                    : "border border-ink-300 bg-surface text-ink-700 hover:bg-ink-100"
                }`}
              >
                {tab.label}
                <span className={active ? "ml-1.5 text-black/60" : "ml-1.5 text-ink-400"}>
                  {countFor(tab.value)}
                </span>
              </Link>
            );
          })}
        </div>

        <form className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto" action="/admin">
          {statusParam !== "all" && <input type="hidden" name="status" value={statusParam} />}
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search brand, name, SKU, serial"
            className="h-12 w-full sm:w-64 rounded-lg border border-ink-300 bg-surface px-3.5 text-base text-ink-900 placeholder:text-ink-400 focus:border-gold-400"
          />
          <button
            type="submit"
            className="h-12 rounded-lg bg-gold-500 px-5 text-base font-semibold text-black hover:bg-gold-400"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mt-6">
        {items.length === 0 ? (
          <div className="rounded-card border border-dashed border-ink-300 bg-surface px-6 py-20 text-center">
            <h2 className="text-lg font-bold text-ink-900">
              {query || statusParam !== "all" ? "Nothing matches that" : "No items yet"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-ink-600">
              {query || statusParam !== "all"
                ? "Try a different search or switch tabs."
                : "Add your first piece and it will appear on the website immediately."}
            </p>
            <Link
              href="/admin/items/new"
              className="mt-6 inline-flex rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-gold-400"
            >
              Add a piece
            </Link>
          </div>
        ) : (
          <AdminInventoryTable items={items} />
        )}
      </div>
    </div>
  );
}
