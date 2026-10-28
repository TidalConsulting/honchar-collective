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
import { formatDop, formatPrice, itemTitle, percentOffRetail } from "@/lib/format";
import { label, shortDate, type Dict } from "@/lib/i18n/dictionaries";
import { getT } from "@/lib/i18n/server";
import { getItemBySlug, getSimilarItems } from "@/lib/items";
import { addressLine, cityState, site } from "@/lib/site";
import { siteUrl } from "@/lib/url";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [item, { t }] = await Promise.all([getItemBySlug(slug), getT()]);
  if (!item) return { title: t.item.notFound };

  const title = `${itemTitle(item)} — ${formatPrice(item.price)}`;
  return {
    title,
    description:
      item.description?.slice(0, 180) ??
      t.item.metaDescription(itemTitle(item), site.name, cityState ?? ""),
  };
}

export default async function ItemDetailPage({ params }: Props) {
  const { slug } = await params;
  const [item, { lang, t }] = await Promise.all([getItemBySlug(slug), getT()]);
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
    { label: t.item.spec.brand, value: item.brand },
    { label: t.item.spec.category, value: label(t.category, item.category) },
    { label: t.item.spec.condition, value: label(t.condition, item.condition) },
    { label: t.item.spec.size, value: item.size ?? "—" },
    { label: t.item.spec.color, value: item.color ?? "—" },
    { label: t.item.spec.material, value: item.material ?? "—" },
    { label: t.item.spec.hardware, value: item.hardware ? label(t.hardware, item.hardware) : "—" },
    { label: t.item.spec.year, value: item.year ? String(item.year) : "—" },
    { label: t.item.spec.for, value: item.gender ? label(t.gender, item.gender) : "—" },
    { label: t.item.spec.sku, value: item.sku ?? "—" },
  ];

  const whatsappMessage = t.whatsapp.msgItem(title, item.sku, `${siteUrl()}/shop/${item.slug}`);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <TrackItemView id={item.id} title={title} price={item.price} />

      <nav aria-label="Breadcrumb" className="mb-6 text-xs uppercase tracking-[0.16em] text-ink-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-gold-400">{t.item.home}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/shop" className="hover:text-gold-400">{t.item.shop}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/shop?category=${encodeURIComponent(item.category)}`}
              className="hover:text-gold-400"
            >
              {label(t.category, item.category)}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink-800">{item.brand}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="mb-5 lg:hidden">
            <PriceBlock item={item} drop={drop} title={title} sold={sold} t={t} />
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
              <SectionHeading>{t.item.piece}</SectionHeading>
              <div className="mt-4 space-y-3 text-[0.97rem] leading-relaxed text-ink-700">
                {item.description.split(/\n{2,}/).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10">
            <SectionHeading>{t.item.details}</SectionHeading>
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
              <SectionHeading>{t.item.comesWith}</SectionHeading>
              <ul className="mt-4 flex flex-wrap gap-2">
                {item.includes.map((entry) => (
                  <li
                    key={entry}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink-300 px-3.5 py-1.5 text-sm text-ink-800"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gold-500" fill="none">
                      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {label(t.includes, entry)}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-card border border-ink-200 bg-surface p-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-500">
                {t.item.conditionHeading(label(t.condition, item.condition))}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                {label(t.conditionDetail, item.condition)}
              </p>
            </div>
            <div className="rounded-card border border-ink-200 bg-surface p-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-500">
                {t.item.authenticity}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                {item.authenticated
                  ? (item.authenticationNote ?? t.item.authenticDefault)
                  : t.item.authenticPending}
              </p>
            </div>
          </section>

          <section className="mt-10 rounded-card border border-ink-200 bg-surface p-6">
            <SectionHeading>{t.item.how}</SectionHeading>
            <ol className="mt-5 grid gap-6 sm:grid-cols-3">
              {t.item.howSteps.map((entry, index) => ({ ...entry, step: String(index + 1) })).map((entry) => (
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
              <PriceBlock item={item} drop={drop} title={title} sold={sold} t={t} />
            </div>

            {inTransit && (
              <div className="rounded-card border border-gold-500/50 bg-gold-50 p-5">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-400">
                  {t.item.onTheWay}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">
                  {item.arrivesAt
                    ? t.item.expected(site.city, shortDate(item.arrivesAt, lang))
                    : t.item.usually(site.shippingDays)}{" "}
                  {t.item.reserveNow}
                </p>
              </div>
            )}

            <div className="rounded-card border border-ink-200 bg-surface p-5">
              {sold ? (
                <>
                  <h3 className="font-serif text-xl text-ink-900">{t.item.soldTitle}</h3>
                  <p className="mt-1 text-sm text-ink-600">{t.item.soldBody(site.shippingDays)}</p>
                  <Link
                    href="/request"
                    className="mt-4 block rounded-full bg-gold-500 px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.14em] text-black hover:bg-gold-400"
                  >
                    {t.item.findOne}
                  </Link>
                  <Link
                    href={`/shop?category=${encodeURIComponent(item.category)}`}
                    className="mt-2 block rounded-full border border-ink-300 px-5 py-3 text-center text-sm font-semibold text-ink-800 hover:bg-ink-100"
                  >
                    {t.item.browseSimilar}
                  </Link>
                </>
              ) : (
                <>
                  <WhatsAppButton message={whatsappMessage} itemId={item.id} className="w-full" />
                  <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-ink-400">
                    <span className="h-px flex-1 bg-ink-200" />
                    {t.item.orDetails}
                    <span className="h-px flex-1 bg-ink-200" />
                  </div>
                  <LeadForm
                    itemId={item.id}
                    heading={inTransit ? t.item.reserveHeading : t.item.checkHeading}
                    subheading={item.sku ? t.item.askSku(item.sku) : t.item.askPiece}
                    submitLabel={inTransit ? t.item.reserveButton : t.item.checkHeading}
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
                  {t.item.reviews(site.reviews.count)}
                </div>
              )}
              <p className="mt-2 text-sm text-ink-600">
                {addressLine ?? t.item.showroom(cityState ?? "")}
              </p>
              <a
                href={site.phoneHref}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-ink-300 px-5 py-3 text-sm font-semibold text-ink-900 hover:bg-ink-100"
              >
                {t.item.call(site.phone)}
              </a>
            </div>

            {!sold && item.price >= LAYAWAY_MIN_PRICE && <LayawayCalculator price={item.price} />}
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl text-ink-900">{t.item.alsoLike}</h2>
            <Link href="/shop" className="text-sm font-semibold text-gold-500 hover:underline">
              {t.item.viewAll}
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
  t,
}: {
  t: Dict;
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
          {label(t.condition, item.condition)}
        </span>
        {item.authenticated && (
          <span className="rounded-full border border-gold-500/60 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gold-400">
            {t.card.authenticated}
          </span>
        )}
        {sold && (
          <span className="rounded-full bg-red-700 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white">
            {t.card.sold}
          </span>
        )}
        {drop && !sold && (
          <span className="rounded-full bg-emerald-700 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white">
            {t.item.priceDrop(formatPrice(drop))}
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <p className="text-4xl font-medium tracking-tight text-ink-900 tabular-nums">
          {formatPrice(item.price)}
        </p>
        {item.retailPrice && item.retailPrice > item.price && (
          <p className="text-base text-ink-500 line-through tabular-nums">
            {t.item.retail(formatPrice(item.retailPrice))}
          </p>
        )}
      </div>
      <p className="mt-1 text-sm text-ink-500 tabular-nums">
        {formatDop(item.price)}
        {off ? <span className="ml-2 font-semibold text-gold-400">{t.card.belowRetail(off)}</span> : null}
      </p>
      {instalment && (
        <p className="mt-2 text-sm text-ink-600">
          {t.item.layawayLine}{" "}
          <span className="font-semibold text-ink-900">
            {t.item.layawayPlan(
              LAYAWAY_DEFAULTS.depositPercent,
              LAYAWAY_DEFAULTS.payments,
              formatPrice(instalment),
            )}
          </span>
        </p>
      )}

      <div className="mt-5">
        <SaveButton itemId={item.id} withLabel />
      </div>
    </div>
  );
}
