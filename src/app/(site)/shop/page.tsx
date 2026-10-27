import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { InventoryFilters } from "@/components/InventoryFilters";
import { FilterChips, Pagination, SortSelect } from "@/components/InventoryToolbar";
import { MobileFilterDrawer } from "@/components/MobileFilterDrawer";
import { ItemCard } from "@/components/ItemCard";
import { cityState } from "@/lib/site";
import { getInventory, parseFilters, type SearchParams } from "@/lib/items";

export const metadata: Metadata = {
  title: "Shop the Collection",
  description:
    "Authentic designer handbags, shoes, watches, jewelry, and ready-to-wear, in Santo Domingo or on the way from the US.",
};

export const dynamic = "force-dynamic";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const result = await getInventory(filters);

  const heading =
    filters.availability === "sold"
      ? "Recently sold"
      : filters.arrival === "arriving"
        ? "Arriving soon"
        : filters.brand.length === 1 && filters.category.length <= 1
          ? `${filters.brand[0]}${filters.category.length ? ` ${filters.category[0]}` : ""}`
          : filters.category.length === 1
            ? filters.category[0]
            : "The collection";

  // "Authenticated and ready" is a claim about stock you can still buy, so it
  // can't run over a list of pieces that have already gone.
  const count = `${result.total.toLocaleString()} ${result.total === 1 ? "piece" : "pieces"}`;
  const subheading =
    filters.availability === "sold"
      ? `${count} we've sold recently — a feel for what moves through here and how fast.`
      : filters.availability === "all"
        ? `${count}, available and recently sold together.`
        : filters.arrival === "arriving"
          ? `${count} already bought in the US and on the way. Reserve one before it lands.`
          : `${count} in ${cityState} or on the way — every one authenticated, priced in dollars.`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-500">Shop</p>
          <h1 className="mt-2 font-serif text-4xl text-ink-900 sm:text-5xl">{heading}</h1>
          <p className="mt-2 text-ink-600">{subheading}</p>
        </div>
        <div className="flex items-center gap-3">
          <Suspense fallback={null}>
            <MobileFilterDrawer
              facets={result.facets}
              priceRange={result.priceRange}
              total={result.total}
            />
          </Suspense>
          <Suspense fallback={null}>
            <SortSelect />
          </Suspense>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-[19rem] shrink-0 lg:block">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8 pr-1">
            <Suspense fallback={<FilterSkeleton />}>
              <InventoryFilters
                facets={result.facets}
                priceRange={result.priceRange}
                total={result.total}
              />
            </Suspense>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <Suspense fallback={null}>
            <FilterChips />
          </Suspense>

          {result.items.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {result.items.map((item, index) => (
                  <ItemCard key={item.id} item={item} priority={index < 3} />
                ))}
              </div>
              <Suspense fallback={null}>
                <Pagination page={result.page} pageCount={result.pageCount} />
              </Suspense>
              <p className="mt-4 text-center text-sm text-ink-500">
                Showing page {result.page} of {result.pageCount}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-card border border-dashed border-ink-300 bg-surface px-6 py-20 text-center">
      <h2 className="font-serif text-2xl text-ink-900">Nothing matches those filters</h2>
      <p className="mx-auto mt-2 max-w-md text-ink-600">
        Try widening the price range or clearing a filter or two. Or tell us exactly what you
        want and we&apos;ll find it in the US for you.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/shop"
          className="rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-gold-400"
        >
          Clear all filters
        </Link>
        <Link
          href="/request"
          className="rounded-full border border-ink-300 px-5 py-2.5 text-sm font-semibold text-ink-800 hover:bg-ink-100"
        >
          Request an item
        </Link>
      </div>
    </div>
  );
}

function FilterSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-card border border-ink-200 bg-surface" />
      ))}
    </div>
  );
}
