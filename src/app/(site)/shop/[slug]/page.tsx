import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ItemCard } from "@/components/ItemCard";
import { ItemGallery } from "@/components/ItemGallery";
import { LeadForm } from "@/components/LeadForm";
import { LayawayCalculator } from "@/components/LayawayCalculator";
import { SaveButton } from "@/components/SaveButton";
import { TrackItemView } from "@/components/TrackItemView";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { LAYAWAY_DEFAULTS, LAYAWAY_MIN_PRICE, estimatedInstalment } from "@/lib/finance";
import {
  CONDITION_DETAIL,
  CONDITION_LABEL,
  formatDop,
  formatPrice,
  formatShortDate,
  itemTitle,
  percentOffRetail,
} from "@/lib/format";
import { getItemBySlug, getSimilarItems } from "@/lib/items";
import { addressLine, cityState, site } from "@/lib/site";
import { siteUrl } from "@/lib/url";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) return { title: "Item not found" };

  const title = `${itemTitle(item)} — ${formatPrice(item.price)}`;
  return {
    title,
    description:
      item.description?.slice(0, 180) ??
      `Authentic ${itemTitle(item)} for sale at ${site.name}, delivered in ${cityState}.`,
  };
}

export default async function ItemDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) notFound();

  const title = itemTitle(item);
  const sold = item.status === "SOLD";
  const inTransit = !sold && item.arrival === "IN_TRANSIT";
  const similar = await getSimilarItems(item);

  const drop =
    item.previousPrice && item.previousPrice > item.price
      ? item.previousPrice - item.price
      : null;

  const details: { label: string; value: string }[] = [
    { label: "Brand", value: item.brand },
    { label: "Category", value: item.category },
    { label: "Condition", value: CONDITION_LABEL[item.condition] },
    { label: "Size", value: item.size ?? "—" },
    { label: "Color", value: item.color ?? "—" },
    { label: "Material", value: item.material ?? "—" },
    { label: "Hardware", value: item.hardware ?? "—" },
    { label: "Year", value: item.year ? String(item.year) : "—" },
    { label: "For", value: item.gender ?? "—" },
    { label: "SKU", value: item.sku ?? "—" },
  ];

  const whatsappMessage = `Hi! I'm interested in the ${title}${item.sku ? ` (SKU ${item.sku})` : ""} — ${siteUrl()}/shop/${item.slug}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <TrackItemView id={item.id} title={title} price={item.price} />

      <nav aria-label="Breadcrumb" className="mb-6 text-xs uppercase tracking-[0.16em] text-ink-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-gold-400">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/shop" className="hover:text-gold-400">Shop</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/shop?category=${encodeURIComponent(item.category)}`}
              className="hover:text-gold-400"
            >
              {item.category}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink-800">{item.brand}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="mb-5 lg:hidden">
            <PriceBlock item={item} drop={drop} title={title} sold={sold} />
          </div>

          <ItemGallery
            images={item.images}
            category={item.category}
            color={item.color}
            brand={item.brand}
            title={title}
          />

          {item.description && (
            <section className="mt-10">
              <SectionHeading>The piece</SectionHeading>
              <div className="mt-4 space-y-3 text-[0.97rem] leading-relaxed text-ink-700">
                {item.description.split(/\n{2,}/).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10">
            <SectionHeading>Details</SectionHeading>
            <dl className="mt-4 grid overflow-hidden rounded-card border border-ink-200 bg-surface sm:grid-cols-2">
              {details.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-baseline justify-between gap-4 border-b border-ink-200 px-5 py-3.5"
                >
                  <dt className="text-sm text-ink-500">{spec.label}</dt>
                  <dd className="text-right text-sm font-medium text-ink-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {item.includes.length > 0 && (
            <section className="mt-10">
              <SectionHeading>Comes with</SectionHeading>
              <ul className="mt-4 flex flex-wrap gap-2">
                {item.includes.map((entry) => (
                  <li
                    key={entry}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink-300 px-3.5 py-1.5 text-sm text-ink-800"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gold-500" fill="none">
                      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {entry}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-card border border-ink-200 bg-surface p-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-500">
                Condition · {CONDITION_LABEL[item.condition]}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                {CONDITION_DETAIL[item.condition]}
              </p>
            </div>
            <div className="rounded-card border border-ink-200 bg-surface p-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-500">
                Authenticity
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                {item.authenticated
                  ? (item.authenticationNote ??
                    "Inspected and authenticated before it was listed. If it is ever proven not genuine, you get every peso back.")
                  : "Authentication is in progress. This piece cannot be purchased until it has been verified."}
              </p>
            </div>
          </section>

          <section className="mt-10 rounded-card border border-ink-200 bg-surface p-6">
            <SectionHeading>How it works</SectionHeading>
            <ol className="mt-5 grid gap-6 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Reserve it",
                  body: "Send us a WhatsApp or the form. We hold the piece for 24 hours while we talk it through.",
                },
                {
                  step: "2",
                  title: "See it up close",
                  body: "Get a live video of the piece, or visit us by appointment to see it in person.",
                },
                {
                  step: "3",
                  title: "Pay your way",
                  body: "Pay in full, or put down a deposit and finish on layaway. Delivery anywhere in the DR.",
                },
              ].map((entry) => (
                <li key={entry.step}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-500 font-serif text-sm text-gold-400">
                    {entry.step}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-ink-900">{entry.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{entry.body}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="min-w-0">
          <div className="space-y-5 lg:sticky lg:top-28">
            <div className="hidden lg:block">
              <PriceBlock item={item} drop={drop} title={title} sold={sold} />
            </div>

            {inTransit && (
              <div className="rounded-card border border-gold-500/50 bg-gold-50 p-5">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-400">
                  On its way from the US
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">
                  {item.arrivesAt
                    ? `Expected in ${site.city} around ${formatShortDate(item.arrivesAt)}.`
                    : `Usually ${site.shippingDays} days door to door.`}{" "}
                  Reserve it now and it&apos;s yours the day it lands.
                </p>
              </div>
            )}

            <div className="rounded-card border border-ink-200 bg-surface p-5">
              {sold ? (
                <>
                  <h3 className="font-serif text-xl text-ink-900">This piece has sold</h3>
                  <p className="mt-1 text-sm text-ink-600">
                    Tell us what you were after. We can find another one in the US and ship it to
                    you, usually within {site.shippingDays} days.
                  </p>
                  <Link
                    href="/request"
                    className="mt-4 block rounded-full bg-gold-500 px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.14em] text-black hover:bg-gold-400"
                  >
                    Find me one
                  </Link>
                  <Link
                    href={`/shop?category=${encodeURIComponent(item.category)}`}
                    className="mt-2 block rounded-full border border-ink-300 px-5 py-3 text-center text-sm font-semibold text-ink-800 hover:bg-ink-100"
                  >
                    Browse similar pieces
                  </Link>
                </>
              ) : (
                <>
                  <WhatsAppButton message={whatsappMessage} itemId={item.id} className="w-full" />
                  <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-ink-400">
                    <span className="h-px flex-1 bg-ink-200" />
                    or leave your details
                    <span className="h-px flex-1 bg-ink-200" />
                  </div>
                  <LeadForm
                    itemId={item.id}
                    heading={inTransit ? "Reserve before it lands" : "Check availability"}
                    subheading={item.sku ? `Ask about SKU ${item.sku}` : `Ask about this piece`}
                    submitLabel={inTransit ? "Reserve this piece" : "Check availability"}
                    compact
                    defaultMessage=""
                  />
                </>
              )}
            </div>

            <div className="rounded-card border border-ink-200 bg-surface p-5">
              <h3 className="font-serif text-lg text-ink-900">{site.name}</h3>
              {site.reviews && (
                <div className="mt-1 flex items-center gap-1.5 text-sm text-ink-600">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold-400" fill="currentColor">
                    <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6.1L12 16.8 6.6 19.7l1.2-6.1L3.3 9.4l6.1-.8L12 3Z" />
                  </svg>
                  {site.reviews.rating} · {site.reviews.count}{" "}
                  {site.reviews.count === 1 ? "review" : "reviews"}
                </div>
              )}
              <p className="mt-2 text-sm text-ink-600">
                {addressLine ?? `${cityState} · showroom by appointment`}
              </p>
              <a
                href={site.phoneHref}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-ink-300 px-5 py-3 text-sm font-semibold text-ink-900 hover:bg-ink-100"
              >
                Call {site.phone}
              </a>
            </div>

            {!sold && item.price >= LAYAWAY_MIN_PRICE && <LayawayCalculator price={item.price} />}
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl text-ink-900">You may also like</h2>
            <Link href="/shop" className="text-sm font-semibold text-gold-500 hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((entry) => (
              <ItemCard key={entry.id} item={entry} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-ink-900">{children}</h2>
      <div className="gold-rule mt-3 w-24" aria-hidden="true" />
    </div>
  );
}

function PriceBlock({
  item,
  drop,
  title,
  sold,
}: {
  item: {
    id: string;
    brand: string;
    name: string;
    price: number;
    retailPrice: number | null;
    condition: string;
    authenticated: boolean;
  };
  drop: number | null;
  title: string;
  sold: boolean;
}) {
  const off = percentOffRetail(item.price, item.retailPrice);
  const instalment = sold ? null : estimatedInstalment(item.price);

  return (
    <div className="w-full">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-500">{item.brand}</p>
      <h1 className="mt-2 text-balance font-serif text-3xl leading-tight text-ink-900 sm:text-4xl">
        {item.name}
        <span className="sr-only"> — {title}</span>
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-ink-300 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-700">
          {CONDITION_LABEL[item.condition]}
        </span>
        {item.authenticated && (
          <span className="rounded-full border border-gold-500/60 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gold-400">
            Authenticated
          </span>
        )}
        {sold && (
          <span className="rounded-full bg-red-700 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white">
            Sold
          </span>
        )}
        {drop && !sold && (
          <span className="rounded-full bg-emerald-700 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white">
            {formatPrice(drop)} price drop
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <p className="text-4xl font-medium tracking-tight text-ink-900 tabular-nums">
          {formatPrice(item.price)}
        </p>
        {item.retailPrice && item.retailPrice > item.price && (
          <p className="text-base text-ink-500 line-through tabular-nums">
            Retail {formatPrice(item.retailPrice)}
          </p>
        )}
      </div>
      <p className="mt-1 text-sm text-ink-500 tabular-nums">
        {formatDop(item.price)}
        {off ? <span className="ml-2 font-semibold text-gold-400">{off}% below retail</span> : null}
      </p>
      {instalment && (
        <p className="mt-2 text-sm text-ink-600">
          Or layaway:{" "}
          <span className="font-semibold text-ink-900">
            {LAYAWAY_DEFAULTS.depositPercent}% down, then {LAYAWAY_DEFAULTS.payments} payments of $
            {instalment.toLocaleString()}
          </span>
        </p>
      )}

      <div className="mt-5">
        <SaveButton itemId={item.id} withLabel />
      </div>
    </div>
  );
}
