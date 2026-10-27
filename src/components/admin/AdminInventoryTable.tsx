"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  deleteItem,
  duplicateItem,
  setItemStatus,
  toggleItemFeatured,
} from "@/app/actions/items";
import { ItemIllustration } from "@/components/ItemIllustration";
import { formatPrice, formatShortDate } from "@/lib/format";

type Row = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  category: string;
  color: string | null;
  price: number;
  status: "DRAFT" | "PUBLISHED" | "SOLD";
  featured: boolean;
  sku: string | null;
  arrival: "IN_DR" | "IN_TRANSIT";
  arrivesAt: Date | null;
  listedAt: Date | null;
  costPrice: number | null;
  importCost: number | null;
  updatedAt: Date;
  images: { url: string }[];
  _count: { leads: number };
  /** Listing views and WhatsApp taps over the last 30 days. */
  views30: number;
  whatsapp30: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** How long a live piece has been listed; the number that says it's time to cut the price. */
function daysListed(row: Row) {
  if (row.status !== "PUBLISHED" || !row.listedAt) return null;
  return Math.floor((Date.now() - new Date(row.listedAt).getTime()) / DAY_MS);
}

const STATUS_STYLE: Record<Row["status"], string> = {
  PUBLISHED: "bg-emerald-950/60 text-emerald-300",
  DRAFT: "bg-ink-200 text-ink-700",
  SOLD: "bg-red-950/60 text-red-400",
};

export function AdminInventoryTable({ items }: { items: Row[] }) {
  const [confirming, setConfirming] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-card border border-ink-200 bg-surface">
      <div className="hidden grid-cols-[minmax(0,1fr)_110px_110px_70px_120px_440px] gap-4 border-b border-ink-200 bg-ink-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-ink-500 lg:grid">
        <span>Piece</span>
        <span>Price</span>
        <span>Where</span>
        <span>Status</span>
        <span>Last 30 days</span>
        <span className="text-right">Actions</span>
      </div>

      <ul className="divide-y divide-ink-200">
        {items.map((item) => {
          const deleting = confirming === item.id;
          const days = daysListed(item);
          const landed =
            item.costPrice !== null ? item.costPrice + (item.importCost ?? 0) : null;

          return (
            <li
              key={item.id}
              className="grid grid-cols-1 gap-4 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_110px_110px_70px_120px_440px] lg:items-center"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-ink-100">
                  {item.images[0] ? (
                    <Image
                      src={item.images[0].url}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <ItemIllustration
                      category={item.category}
                      color={item.color}
                      className="h-full w-full"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/admin/items/${item.id}`}
                    className="block truncate text-sm font-bold text-ink-900 hover:text-gold-500"
                  >
                    <span className="text-gold-500">{item.brand}</span> {item.name}
                  </Link>
                  <p className="truncate text-xs text-ink-500">
                    {item.category}
                    {item.sku ? ` · ${item.sku}` : ""}
                    {item.featured ? " · ★ Featured" : ""}
                    {days !== null ? ` · ${days} ${days === 1 ? "day" : "days"} listed` : ""}
                  </p>
                </div>
              </div>

              <div className="text-sm font-semibold text-ink-900 lg:font-bold">
                <span className="mr-2 text-xs font-normal text-ink-500 lg:hidden">Price</span>
                {formatPrice(item.price)}
                {landed !== null && (
                  <span className="block text-xs font-normal text-ink-500">
                    cost {formatPrice(landed)}
                  </span>
                )}
              </div>

              <div className="text-sm text-ink-700">
                <span className="mr-2 text-xs text-ink-500 lg:hidden">Where</span>
                {item.arrival === "IN_TRANSIT" ? (
                  <span className="text-gold-400">
                    In transit{item.arrivesAt ? ` · ${formatShortDate(item.arrivesAt)}` : ""}
                  </span>
                ) : (
                  "In the DR"
                )}
              </div>

              <div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[item.status]}`}
                >
                  {item.status === "PUBLISHED" ? "Live" : item.status === "DRAFT" ? "Draft" : "Sold"}
                </span>
              </div>

              <div className="text-xs leading-relaxed text-ink-600 tabular-nums">
                <span className="mr-2 text-ink-500 lg:hidden">Last 30 days</span>
                <span className="font-semibold text-ink-900">{item.views30}</span> views
                <span className="lg:block">
                  <span className="lg:hidden"> · </span>
                  <span className="font-semibold text-ink-900">{item.whatsapp30}</span> WhatsApp ·{" "}
                  <span className="font-semibold text-ink-900">{item._count.leads}</span> leads
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-start gap-1.5 lg:justify-end">
                {deleting ? (
                  <form action={deleteItem} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={item.id} />
                    <span className="text-xs font-semibold text-red-400">Delete for good?</span>
                    <button
                      type="submit"
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                    >
                      Yes, delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirming(null)}
                      className="rounded-lg border border-ink-300 px-3 py-1.5 text-xs font-semibold text-ink-700"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <Link
                      href={`/shop/${item.slug}`}
                      target="_blank"
                      className="rounded-lg border border-ink-300 px-2.5 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/items/${item.id}`}
                      className="rounded-lg border border-ink-300 px-2.5 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100"
                    >
                      Edit
                    </Link>

                    <StatusMenu item={item} />

                    <form action={toggleItemFeatured}>
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        type="submit"
                        title={item.featured ? "Remove from featured" : "Feature on the homepage"}
                        className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
                          item.featured
                            ? "border-gold-500 bg-gold-50 text-gold-300"
                            : "border-ink-300 text-ink-700 hover:bg-ink-100"
                        }`}
                      >
                        ★
                      </button>
                    </form>

                    <form action={duplicateItem}>
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        type="submit"
                        title="Duplicate as a draft"
                        className="rounded-lg border border-ink-300 px-2.5 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100"
                      >
                        Copy
                      </button>
                    </form>

                    <button
                      type="button"
                      onClick={() => setConfirming(item.id)}
                      className="rounded-lg border border-red-900 px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-950/40"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StatusMenu({ item }: { item: Row }) {
  const [sellingPrice, setSellingPrice] = useState<string | null>(null);

  const next =
    item.status === "PUBLISHED"
      ? [{ value: "DRAFT", label: "Unpublish" }]
      : item.status === "DRAFT"
        ? [{ value: "PUBLISHED", label: "Publish" }]
        : [{ value: "PUBLISHED", label: "Relist" }];

  // Marking an item sold is the one moment the final price is known. Asking
  // for it here is what makes "sold at % of list" possible at all — it's
  // optional, so it never blocks recording the sale.
  const markSold = item.status === "PUBLISHED" && (
    sellingPrice === null ? (
      <button
        type="button"
        onClick={() => setSellingPrice("")}
        className="rounded-lg border border-ink-300 px-2.5 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100"
      >
        Mark sold
      </button>
    ) : (
      <form action={setItemStatus} className="flex items-center gap-1.5">
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="status" value="SOLD" />
        <label className="flex items-center gap-1">
          <span className="text-xs font-semibold text-ink-600">Sold for</span>
          <input
            name="soldPrice"
            inputMode="numeric"
            autoFocus
            value={sellingPrice}
            onChange={(event) => setSellingPrice(event.target.value.replace(/[^0-9]/g, ""))}
            placeholder={String(item.price)}
            className="w-24 rounded-lg border border-ink-300 bg-ink-50 px-2 py-1.5 text-xs text-ink-900"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-gold-500 px-3 py-1.5 text-xs font-bold text-black hover:bg-gold-400"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setSellingPrice(null)}
          className="rounded-lg border border-ink-300 px-2.5 py-1.5 text-xs font-semibold text-ink-700"
        >
          Cancel
        </button>
      </form>
    )
  );

  return (
    <>
      {markSold}
      {next.map((option) => (
        <form key={option.value} action={setItemStatus}>
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="status" value={option.value} />
          <button
            type="submit"
            className="rounded-lg border border-ink-300 px-2.5 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100"
          >
            {option.label}
          </button>
        </form>
      ))}
    </>
  );
}
