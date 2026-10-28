import Link from "next/link";

import { HeroImage } from "@/components/HeroImage";
import { HeroSearch } from "@/components/HeroSearch";
import { ItemCard } from "@/components/ItemCard";
import { ItemIllustration } from "@/components/ItemIllustration";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { formatPrice } from "@/lib/format";
import type { Dict } from "@/lib/i18n/dictionaries";
import { label } from "@/lib/i18n/dictionaries";
import { getT } from "@/lib/i18n/server";
import {
  getArrivingSoon,
  getBrandCounts,
  getCategoryCounts,
  getFeaturedItems,
  getInventoryStats,
  getNewArrivals,
  type ItemCard as ItemCardData,
} from "@/lib/items";
import { CATEGORIES, site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { t } = await getT();
  const [featured, stats, arriving, categoryCounts, brands] = await Promise.all([
    getFeaturedItems(8),
    getInventoryStats(),
    getArrivingSoon(4),
    getCategoryCounts(),
    getBrandCounts(),
  ]);
  // "Just in" leaves out anything already shown in The Edit, so the two rows
  // never repeat each other on a small collection.
  const fresh = await getNewArrivals(4, featured.slice(0, 4).map((item) => item.id));

  return (
    <>
      <Hero stats={stats} t={t} />
      {stats.count === 0 ? (
        <EmptyCollection t={t} />
      ) : (
        <>
          <Row
            eyebrow={t.home.edit.eyebrow}
            title={t.home.edit.title}
            blurb={t.home.edit.blurb}
            items={featured.slice(0, 4)}
            href="/shop"
            cta={t.home.edit.cta}
            priority
          />
          <Categories counts={categoryCounts} t={t} />
          <Row
            eyebrow={t.home.fresh.eyebrow}
            title={t.home.fresh.title(site.city)}
            blurb={t.home.fresh.blurb}
            items={fresh}
            href="/shop?sort=newest&arrival=ready"
            cta={t.home.fresh.cta}
          />
          <ArrivingSoon items={arriving} count={stats.inTransit} t={t} />
          <Brands brands={brands} t={t} />
        </>
      )}
      <HowItWorks t={t} />
      <RequestCta t={t} />
    </>
  );
}

function Hero({ stats, t }: { stats: Awaited<ReturnType<typeof getInventoryStats>>; t: Dict }) {
  return (
    <section className="relative overflow-hidden border-b border-gold-500/20 bg-black">
      <HeroImage className="absolute inset-0 h-full w-full object-cover opacity-50" />
      {/* A low gold glow stands in for a photo until there is one, and sits
          under it as a warm scrim once there is. */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 80% 40%, rgba(212,169,64,0.18), transparent 70%), linear-gradient(90deg, #000 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.3))",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-300">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            {t.home.inCollection(stats.count)}
          </span>

          <h1 className="mt-6 text-balance font-serif text-5xl leading-[1.02] text-ink-900 sm:text-6xl lg:text-7xl">
            {t.home.title1}
            <br />
            <em className="text-gold-400">{t.home.title2}</em>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
            {t.home.lede}
          </p>

          <div className="mt-8 max-w-xl">
            <HeroSearch />
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-2 gap-6 border-t border-white/10 pt-6 sm:grid-cols-4">
            {[
              { label: t.home.stats.inStock, value: String(stats.count) },
              { label: t.home.stats.designers, value: String(stats.brandCount) },
              { label: t.home.stats.arriving, value: String(stats.inTransit) },
              {
                label: t.home.stats.from,
                value: stats.startingPrice ? formatPrice(stats.startingPrice) : "—",
              },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-ink-500">{stat.label}</dt>
                <dd className="mt-1 font-serif text-3xl text-ink-900 tabular-nums">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function SectionHead({
  eyebrow,
  title,
  blurb,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-500">{eyebrow}</p>
        <h2 className="mt-2 text-balance font-serif text-3xl text-ink-900 sm:text-4xl">{title}</h2>
        {blurb && <p className="mt-2 text-ink-600">{blurb}</p>}
      </div>
      {href && cta && (
        <Link
          href={href}
          className="hidden shrink-0 border-b border-gold-500 pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold-300 hover:text-gold-400 sm:block"
        >
          {cta} →
        </Link>
      )}
    </div>
  );
}

function Row({
  eyebrow,
  title,
  blurb,
  items,
  href,
  cta,
  priority = false,
}: {
  eyebrow: string;
  title: string;
  blurb: string;
  items: ItemCardData[];
  href: string;
  cta: string;
  priority?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead eyebrow={eyebrow} title={title} blurb={blurb} href={href} cta={cta} />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <ItemCard key={item.id} item={item} priority={priority && index < 2} />
          ))}
        </div>
        <Link
          href={href}
          className="mt-8 block rounded-full border border-gold-500 px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-gold-300 sm:hidden"
        >
          {cta}
        </Link>
      </div>
    </section>
  );
}

function Categories({ counts, t }: { counts: Map<string, number>; t: Dict }) {
  // Only categories with stock, in the configured order, so nothing leads to an empty page.
  const stocked = CATEGORIES.filter((category) => (counts.get(category) ?? 0) > 0).slice(0, 8);
  if (stocked.length === 0) return null;

  return (
    <section className="border-y border-ink-200 bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead eyebrow={t.home.categories.eyebrow} title={t.home.categories.title} />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stocked.map((category) => (
            <Link
              key={category}
              href={`/shop?category=${encodeURIComponent(category)}`}
              className="group overflow-hidden rounded-card border border-ink-200 bg-ink-50 transition-colors hover:border-gold-500/60"
            >
              <ItemIllustration category={category} className="aspect-square w-full transition-transform duration-500 group-hover:scale-105" />
              <div className="flex items-baseline justify-between gap-2 border-t border-ink-200 px-4 py-3">
                <span className="font-serif text-lg text-ink-900">{label(t.category, category)}</span>
                <span className="text-xs text-ink-500 tabular-nums">{counts.get(category)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrivingSoon({ items, count, t }: { items: ItemCardData[]; count: number; t: Dict }) {
  if (items.length === 0) return null;
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-card border border-gold-500/40 bg-gold-50 p-6 sm:p-10">
          <SectionHead
            eyebrow={t.home.arriving.eyebrow(count)}
            title={t.home.arriving.title}
            blurb={t.home.arriving.blurb(site.shippingDays)}
            href="/shop?arrival=arriving"
            cta={t.home.arriving.cta}
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Brands({ brands, t }: { brands: { brand: string; count: number }[]; t: Dict }) {
  if (brands.length === 0) return null;
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead eyebrow={t.home.brands.eyebrow} title={t.home.brands.title} />
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
          {brands.map(({ brand, count }) => (
            <li key={brand}>
              <Link
                href={`/shop?brand=${encodeURIComponent(brand)}`}
                className="group inline-flex items-baseline gap-2"
              >
                <span className="font-serif text-2xl text-ink-800 transition-colors group-hover:text-gold-300">
                  {brand}
                </span>
                <span className="text-xs text-ink-400 tabular-nums">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HowItWorks({ t }: { t: Dict }) {
  // A real sequence: this is the order a piece actually travels in.
  const steps = t.home.how.steps(site.shippingDays);

  return (
    <section className="border-t border-ink-200 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead eyebrow={t.home.how.eyebrow} title={t.home.how.title} />
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="font-serif text-4xl text-gold-500">{index + 1}</span>
              <div className="gold-rule mt-3 w-16" aria-hidden="true" />
              <h3 className="mt-4 text-base font-semibold text-ink-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function RequestCta({ t }: { t: Dict }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 pt-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-6 rounded-card border border-gold-500/40 bg-black p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-500">{t.home.requestCta.eyebrow}</p>
          <h2 className="mt-2 font-serif text-3xl text-ink-900 sm:text-4xl">
            {t.home.requestCta.title}
          </h2>
          <p className="mt-2 max-w-2xl text-ink-600">{t.home.requestCta.body}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:items-end">
          <Link
            href="/request"
            className="rounded-full bg-gold-500 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:bg-gold-400"
          >
            {t.home.requestCta.button}
          </Link>
          <WhatsAppButton variant="compact" label={t.whatsapp.orScreenshot} message={t.whatsapp.msgFind} />
        </div>
      </div>
    </section>
  );
}

function EmptyCollection({ t }: { t: Dict }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-card border border-dashed border-ink-300 bg-surface px-6 py-16 text-center">
        <h2 className="font-serif text-2xl text-ink-900">{t.home.empty.title}</h2>
        <p className="mt-2 text-ink-600">
          {t.home.empty.before}{" "}
          <Link href="/admin" className="font-semibold text-gold-400 hover:underline">
            {t.home.empty.link}
          </Link>{" "}
          {t.home.empty.after}
        </p>
      </div>
    </section>
  );
}
