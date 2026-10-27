import "server-only";

import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { CONDITION_ORDER } from "@/lib/format";
import { SORT_OPTIONS, type SortValue } from "@/lib/sort";

export { SORT_OPTIONS };
export type { SortValue };

export const PAGE_SIZE = 12;

export type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Which listings a shopper is looking at.
 *
 * Sold pieces stay on the site rather than vanishing: a boutique that visibly
 * sells is worth more than one that looks static, and the links keep working
 * for anyone who saved or shared one. "available" is the default so nobody
 * browses sold stock by accident.
 */
export const AVAILABILITY_VALUES = ["available", "sold", "all"] as const;
export type Availability = (typeof AVAILABILITY_VALUES)[number];

const STATUS_SCOPE: Record<Availability, Prisma.ItemWhereInput> = {
  available: { status: "PUBLISHED" },
  sold: { status: "SOLD" },
  all: { status: { in: ["PUBLISHED", "SOLD"] } },
};

export const ARRIVAL_VALUES = ["ready", "arriving"] as const;

export type ItemFilters = {
  q: string;
  availability: Availability;
  category: string[];
  brand: string[];
  condition: string[];
  gender: string[];
  size: string[];
  arrival?: (typeof ARRIVAL_VALUES)[number];
  priceMin?: number;
  priceMax?: number;
  sort: SortValue;
  page: number;
};

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : [value];
  return raw
    .flatMap((entry) => entry.split(","))
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function toInt(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const parsed = Number.parseInt(raw.replace(/[^0-9-]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseFilters(params: SearchParams): ItemFilters {
  const sortRaw = first(params.sort);
  const sort = SORT_OPTIONS.some((option) => option.value === sortRaw)
    ? (sortRaw as SortValue)
    : "best";

  const availabilityRaw = first(params.availability);
  const availability = AVAILABILITY_VALUES.includes(availabilityRaw as Availability)
    ? (availabilityRaw as Availability)
    : "available";

  const arrivalRaw = first(params.arrival);

  return {
    q: first(params.q)?.trim() ?? "",
    availability,
    category: toArray(params.category),
    brand: toArray(params.brand),
    condition: toArray(params.condition).map((c) => c.toUpperCase()),
    gender: toArray(params.gender),
    size: toArray(params.size),
    arrival: ARRIVAL_VALUES.includes(arrivalRaw as (typeof ARRIVAL_VALUES)[number])
      ? (arrivalRaw as (typeof ARRIVAL_VALUES)[number])
      : undefined,
    priceMin: toInt(params.priceMin),
    priceMax: toInt(params.priceMax),
    sort,
    page: Math.max(toInt(params.page) ?? 1, 1),
  };
}

/**
 * Builds the Prisma filter. `skip` omits one facet's own constraint so that
 * facet's option counts stay meaningful (the way a marketplace keeps showing
 * you the other brands you could switch to).
 */
export function buildWhere(
  filters: ItemFilters,
  skip?: keyof ItemFilters,
): Prisma.ItemWhereInput {
  // Counting the availability facet means widening to every listed status;
  // otherwise "sold" would always report the count of whatever is showing now.
  const and: Prisma.ItemWhereInput[] = [
    skip === "availability" ? STATUS_SCOPE.all : STATUS_SCOPE[filters.availability],
  ];

  if (filters.q) {
    const terms = filters.q.split(/\s+/).filter(Boolean).slice(0, 6);
    for (const term of terms) {
      and.push({
        OR: [
          { brand: { contains: term, mode: "insensitive" } },
          { name: { contains: term, mode: "insensitive" } },
          { category: { contains: term, mode: "insensitive" } },
          { color: { contains: term, mode: "insensitive" } },
          { material: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
          { sku: { contains: term, mode: "insensitive" } },
        ],
      });
    }
  }

  if (skip !== "category" && filters.category.length) {
    and.push({ category: { in: filters.category } });
  }
  if (skip !== "brand" && filters.brand.length) and.push({ brand: { in: filters.brand } });
  if (skip !== "condition" && filters.condition.length) {
    and.push({ condition: { in: filters.condition as Prisma.EnumConditionFilter["in"] } });
  }
  if (skip !== "gender" && filters.gender.length) and.push({ gender: { in: filters.gender } });
  if (skip !== "size" && filters.size.length) and.push({ size: { in: filters.size } });
  if (skip !== "arrival" && filters.arrival) {
    and.push({ arrival: filters.arrival === "ready" ? "IN_DR" : "IN_TRANSIT" });
  }
  if (filters.priceMin !== undefined) and.push({ price: { gte: filters.priceMin } });
  if (filters.priceMax !== undefined) and.push({ price: { lte: filters.priceMax } });

  return { AND: and };
}

function buildOrderBy(
  sort: SortValue,
  availability: Availability,
): Prisma.ItemOrderByWithRelationInput[] {
  switch (sort) {
    case "price-asc":
      return [{ price: "asc" }, { createdAt: "desc" }];
    case "price-desc":
      return [{ price: "desc" }, { createdAt: "desc" }];
    case "condition":
      // Postgres sorts an enum in declaration order, which runs best to worst.
      return [{ condition: "asc" }, { price: "asc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    case "best":
    default:
      // On the sold list "best" means most recently sold — featured is a
      // merchandising flag for stock that's still for sale, and a bag that
      // sold in March shouldn't outrank one that sold last week.
      return availability === "sold"
        ? [{ soldAt: "desc" }, { createdAt: "desc" }]
        : [{ featured: "desc" }, { createdAt: "desc" }];
  }
}

export const itemCardSelect = {
  id: true,
  slug: true,
  // `status` drives the sold badge. `soldPrice`, the landed cost, and the
  // serial number are deliberately not selected: what a piece cost and what
  // it went for are the business's own, the serial is how fakes get made,
  // and anything put in this payload reaches the browser.
  status: true,
  brand: true,
  name: true,
  category: true,
  gender: true,
  condition: true,
  price: true,
  retailPrice: true,
  previousPrice: true,
  size: true,
  color: true,
  material: true,
  authenticated: true,
  arrival: true,
  arrivesAt: true,
  featured: true,
  sku: true,
  createdAt: true,
  images: { orderBy: { position: "asc" }, take: 5, select: { url: true, alt: true } },
} satisfies Prisma.ItemSelect;

export type ItemCard = Prisma.ItemGetPayload<{ select: typeof itemCardSelect }>;

export type FacetCount = { value: string; count: number };

export type InventoryResult = {
  items: ItemCard[];
  total: number;
  page: number;
  pageCount: number;
  facets: {
    availability: FacetCount[];
    category: FacetCount[];
    brand: FacetCount[];
    condition: FacetCount[];
    gender: FacetCount[];
    size: FacetCount[];
    arrival: FacetCount[];
  };
  priceRange: { min: number; max: number };
};

async function facetCounts(
  field: "category" | "brand" | "gender" | "size" | "condition",
  filters: ItemFilters,
): Promise<FacetCount[]> {
  const rows = await prisma.item.groupBy({
    by: [field],
    where: buildWhere(filters, field),
    _count: { _all: true },
  });

  return rows
    .filter((row) => row[field] !== null)
    .map((row) => ({ value: String(row[field]), count: row._count._all }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

export async function getInventory(filters: ItemFilters): Promise<InventoryResult> {
  const where = buildWhere(filters);

  const [
    total,
    items,
    statusRows,
    category,
    brand,
    condition,
    gender,
    size,
    arrivalRows,
    aggregate,
  ] = await Promise.all([
    prisma.item.count({ where }),
    prisma.item.findMany({
      where,
      orderBy: buildOrderBy(filters.sort, filters.availability),
      skip: (filters.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: itemCardSelect,
    }),
    prisma.item.groupBy({
      by: ["status"],
      where: buildWhere(filters, "availability"),
      _count: { _all: true },
    }),
    facetCounts("category", filters),
    facetCounts("brand", filters),
    facetCounts("condition", filters),
    facetCounts("gender", filters),
    facetCounts("size", filters),
    prisma.item.groupBy({
      by: ["arrival"],
      where: buildWhere(filters, "arrival"),
      _count: { _all: true },
    }),
    prisma.item.aggregate({
      where: STATUS_SCOPE[filters.availability],
      _min: { price: true },
      _max: { price: true },
    }),
  ]);

  const countFor = (status: "PUBLISHED" | "SOLD") =>
    statusRows.find((row) => row.status === status)?._count._all ?? 0;
  const availableCount = countFor("PUBLISHED");
  const soldCount = countFor("SOLD");
  const arrivalCount = (value: "IN_DR" | "IN_TRANSIT") =>
    arrivalRows.find((row) => row.arrival === value)?._count._all ?? 0;

  return {
    items,
    total,
    page: filters.page,
    pageCount: Math.max(Math.ceil(total / PAGE_SIZE), 1),
    facets: {
      availability: [
        { value: "available", count: availableCount },
        { value: "sold", count: soldCount },
        { value: "all", count: availableCount + soldCount },
      ],
      category,
      brand,
      condition: [...condition].sort(
        (a, b) =>
          CONDITION_ORDER.indexOf(a.value as (typeof CONDITION_ORDER)[number]) -
          CONDITION_ORDER.indexOf(b.value as (typeof CONDITION_ORDER)[number]),
      ),
      gender,
      size: [...size].sort((a, b) => a.value.localeCompare(b.value, "en", { numeric: true })),
      arrival: [
        { value: "ready", count: arrivalCount("IN_DR") },
        { value: "arriving", count: arrivalCount("IN_TRANSIT") },
      ],
    },
    priceRange: {
      min: aggregate._min.price ?? 0,
      max: aggregate._max.price ?? 20000,
    },
  };
}

export async function getItemBySlug(slug: string) {
  return prisma.item.findFirst({
    where: { slug, status: { in: ["PUBLISHED", "SOLD"] } },
    include: { images: { orderBy: { position: "asc" } } },
  });
}

export async function getSimilarItems(item: {
  id: string;
  category: string;
  brand: string;
  price: number;
}) {
  // Same category, or same brand in a similar price band — the two ways a
  // shopper who missed this piece is most likely to want a substitute.
  const rows = await prisma.item.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: item.id },
      OR: [
        { category: item.category },
        { brand: item.brand, price: { gte: item.price * 0.5, lte: item.price * 1.5 } },
      ],
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 12,
    select: itemCardSelect,
  });
  const score = (row: ItemCard) =>
    (row.category === item.category ? 2 : 0) + (row.brand === item.brand ? 1 : 0);
  return rows.sort((a, b) => score(b) - score(a)).slice(0, 4);
}

/** Pieces staff have starred. Falls back to the newest when nothing is starred yet. */
export async function getFeaturedItems(take = 8) {
  return prisma.item.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take,
    select: itemCardSelect,
  });
}

export async function getNewArrivals(take = 4, excludeIds: string[] = []) {
  return prisma.item.findMany({
    where: { status: "PUBLISHED", arrival: "IN_DR", id: { notIn: excludeIds } },
    orderBy: [{ listedAt: "desc" }, { createdAt: "desc" }],
    take,
    select: itemCardSelect,
  });
}

/** Still on its way from the US — listed so shoppers can reserve before it lands. */
export async function getArrivingSoon(take = 4) {
  return prisma.item.findMany({
    where: { status: "PUBLISHED", arrival: "IN_TRANSIT" },
    orderBy: [{ arrivesAt: "asc" }, { createdAt: "desc" }],
    take,
    select: itemCardSelect,
  });
}

export async function getCategoryCounts() {
  const rows = await prisma.item.groupBy({
    by: ["category"],
    where: { status: "PUBLISHED" },
    _count: { _all: true },
  });
  return new Map(rows.map((row) => [row.category, row._count._all]));
}

export async function getBrandCounts() {
  const rows = await prisma.item.groupBy({
    by: ["brand"],
    where: { status: "PUBLISHED" },
    _count: { _all: true },
  });
  return rows
    .map((row) => ({ brand: row.brand, count: row._count._all }))
    .sort((a, b) => b.count - a.count || a.brand.localeCompare(b.brand));
}

export async function getInventoryStats() {
  const [count, aggregate, brands, inTransit, sold] = await Promise.all([
    prisma.item.count({ where: { status: "PUBLISHED" } }),
    prisma.item.aggregate({
      where: { status: "PUBLISHED" },
      _min: { price: true },
    }),
    prisma.item.groupBy({ by: ["brand"], where: { status: "PUBLISHED" } }),
    prisma.item.count({ where: { status: "PUBLISHED", arrival: "IN_TRANSIT" } }),
    prisma.item.count({ where: { status: "SOLD" } }),
  ]);
  return {
    count,
    startingPrice: aggregate._min.price ?? 0,
    brandCount: brands.length,
    inTransit,
    sold,
  };
}
