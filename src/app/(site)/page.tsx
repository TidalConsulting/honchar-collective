import Link from "next/link";

import { HeroImage } from "@/components/HeroImage";
import { HeroSearch } from "@/components/HeroSearch";
import { ItemCard } from "@/components/ItemCard";
import { ItemIllustration } from "@/components/ItemIllustration";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { formatPrice } from "@/lib/format";
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
      <Hero stats={stats} />
      {stats.count === 0 ? (
        <EmptyCollection />
      ) : (
        <>
          <Row
            eyebrow="The Edit"
            title="Highlighted this week"
            blurb="Hand-picked by our buyers. The pieces we'd reach for first."
            items={featured.slice(0, 4)}
            href="/shop"
            cta="Shop the collection"
            priority
          />
          <Categories counts={categoryCounts} />
          <Row
            eyebrow="Just in"
            title="New in Santo Domingo"
            blurb="Unpacked, authenticated, and ready to go home with you today."
            items={fresh}
            href="/shop?sort=newest&arrival=ready"
            cta="See everything new"
          />
          <ArrivingSoon items={arriving} count={stats.inTransit} />
          <Brands brands={brands} />
        </>
      )}
      <HowItWorks />
      <RequestCta />
    </>
  );
}

function Hero({ stats }: { stats: Awaited<ReturnType<typeof getInventoryStats>> }) {
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
            {stats.count} pieces in the collection
          </span>

          <h1 className="mt-6 text-balance font-serif text-5xl leading-[1.02] text-ink-900 sm:text-6xl lg:text-7xl">
            Authentic luxury,
            <br />
            <em className="text-gold-400">delivered home.</em>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
            Handbags, shoes, watches, and jewelry from the houses you love, bought in the United
            States, authenticated, and brought to you in the Dominican Republic.
          </p>

          <div className="mt-8 max-w-xl">
            <HeroSearch />
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-2 gap-6 border-t border-white/10 pt-6 sm:grid-cols-4">
            {[
              { label: "In stock", value: String(stats.count) },
              { label: "Designers", value: String(stats.brandCount) },
              { label: "Arriving soon", value: String(stats.inTransit) },
              {
                label: "Starting at",
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

function Categories({ counts }: { counts: Map<string, number> }) {
  // Only categories with stock, in the configured order, so nothing leads to an empty page.
  const stocked = CATEGORIES.filter((category) => (counts.get(category) ?? 0) > 0).slice(0, 8);
  if (stocked.length === 0) return null;

  return (
    <section className="border-y border-ink-200 bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead eyebrow="Shop by category" title="Find your next piece" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stocked.map((category) => (
            <Link
              key={category}
              href={`/shop?category=${encodeURIComponent(category)}`}
              className="group overflow-hidden rounded-card border border-ink-200 bg-ink-50 transition-colors hover:border-gold-500/60"
            >
              <ItemIllustration category={category} className="aspect-square w-full transition-transform duration-500 group-hover:scale-105" />
              <div className="flex items-baseline justify-between gap-2 border-t border-ink-200 px-4 py-3">
                <span className="font-serif text-lg text-ink-900">{category}</span>
                <span className="text-xs text-ink-500 tabular-nums">{counts.get(category)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrivingSoon({ items, count }: { items: ItemCardData[]; count: number }) {
  if (items.length === 0) return null;
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-card border border-gold-500/40 bg-gold-50 p-6 sm:p-10">
          <SectionHead
            eyebrow={`Arriving soon · ${count} in transit`}
            title="Reserve it before it lands"
            blurb={`These pieces are already bought and on their way from the US, usually ${site.shippingDays} days door to door. Reserve one now and it's yours the day it arrives.`}
            href="/shop?arrival=arriving"
            cta="See all arriving"
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

function Brands({ brands }: { brands: { brand: string; count: number }[] }) {
  if (brands.length === 0) return null;
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead eyebrow="Designers" title="The houses in the collection" />
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

function HowItWorks() {
  // A real sequence: this is the order a piece actually travels in.
  const steps = [
    {
      title: "Bought in the US",
      body: "From boutiques, authorised resellers, and private sellers we've vetted. Never from a marketplace we can't verify.",
    },
    {
      title: "Authenticated twice",
      body: "Checked before it ships and again when it lands. Stitching, hardware, date codes, and materials.",
    },
    {
      title: "Shipped and cleared",
      body: `We handle the freight and customs. Usually ${site.shippingDays} days from purchase to the showroom.`,
    },
    {
      title: "Yours, your way",
      body: "Pay in full or on interest-free layaway. Delivered anywhere in the DR, or collect by appointment.",
    },
  ];

  return (
    <section className="border-t border-ink-200 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead eyebrow="How it works" title="From the US to your door" />
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

function RequestCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 pt-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-6 rounded-card border border-gold-500/40 bg-black p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-500">Personal sourcing</p>
          <h2 className="mt-2 font-serif text-3xl text-ink-900 sm:text-4xl">
            Don&apos;t see it? We&apos;ll find it.
          </h2>
          <p className="mt-2 max-w-2xl text-ink-600">
            Send us the bag, the watch, or the sneaker, with your size. We source it in the US and
            send you one all-in price, shipping and customs included.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:items-end">
          <Link
            href="/request"
            className="rounded-full bg-gold-500 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:bg-gold-400"
          >
            Request an item
          </Link>
          <WhatsAppButton variant="compact" label="Or send a screenshot" message="Hi! I'm looking for a piece. Can you help me find it?" />
        </div>
      </div>
    </section>
  );
}

function EmptyCollection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-card border border-dashed border-ink-300 bg-surface px-6 py-16 text-center">
        <h2 className="font-serif text-2xl text-ink-900">The collection is being unpacked</h2>
        <p className="mt-2 text-ink-600">
          Sign in to the{" "}
          <Link href="/admin" className="font-semibold text-gold-400 hover:underline">
            staff dashboard
          </Link>{" "}
          to list your first piece.
        </p>
      </div>
    </section>
  );
}
