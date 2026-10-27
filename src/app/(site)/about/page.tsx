import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/PageIntro";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { addressLine, cityState, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} brings authentic luxury from the United States to customers in ${cityState}.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <PageIntro eyebrow="Our story" title="Luxury shouldn't depend on where you live." />

      <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-700">
        <p>
          The boutiques are in Miami and New York. The releases sell out online in minutes and
          rarely ship to the Dominican Republic. And the pieces that do turn up locally come with
          no way of knowing whether they&apos;re real.
        </p>
        <p>
          {site.name} closes that gap. We buy in the United States, from boutiques, authorised
          resellers, and private sellers we&apos;ve vetted, and bring each piece home to the DR.
          Every one is inspected and authenticated before it&apos;s listed, priced in plain dollars,
          and delivered to your door.
        </p>
        <p>
          If something isn&apos;t in the collection, ask. Finding the exact bag, size, or watch a
          client wants is half of what we do.
        </p>
        <p className="font-serif text-2xl text-gold-300">
          Real pieces, fair prices, and the same access as anywhere else.
        </p>
      </div>

      <dl className="mt-12 grid gap-px overflow-hidden rounded-card border border-ink-200 bg-ink-200 sm:grid-cols-3">
        {[
          { label: "Every piece authenticated", value: "100%" },
          { label: "From US purchase to your door", value: `${site.shippingDays} days` },
          { label: "Interest on layaway", value: "0%" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface p-6 text-center">
            <dd className="font-serif text-3xl text-gold-300">{stat.value}</dd>
            <dt className="mt-1 text-sm text-ink-600">{stat.label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-12 rounded-card border border-gold-500/40 bg-black p-8 text-center">
        <h2 className="font-serif text-3xl text-ink-900">Come see the collection</h2>
        <p className="mt-2 text-ink-500">{addressLine ?? `${cityState} · showroom by appointment`}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className="rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-black hover:bg-gold-400"
          >
            Shop now
          </Link>
          <WhatsAppButton variant="outline" label="Book a visit" message="Hi! I'd like to book a showroom visit." />
        </div>
      </div>
    </div>
  );
}
