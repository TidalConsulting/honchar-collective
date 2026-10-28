import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/PageIntro";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getT } from "@/lib/i18n/server";
import { addressLine, cityState, site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.nav.about, description: t.about.metaDescription(site.name, cityState ?? "") };
}

export default async function AboutPage() {
  const { t } = await getT();
  const a = t.about;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <PageIntro eyebrow={a.eyebrow} title={a.title} />

      <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-700">
        {a.paragraphs(site.name).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="font-serif text-2xl text-gold-300">{a.closing}</p>
      </div>

      <dl className="mt-12 grid gap-px overflow-hidden rounded-card border border-ink-200 bg-ink-200 sm:grid-cols-3">
        {a.stats(site.shippingDays).map((stat) => (
          <div key={stat.label} className="bg-surface p-6 text-center">
            <dd className="font-serif text-3xl text-gold-300">{stat.value}</dd>
            <dt className="mt-1 text-sm text-ink-600">{stat.label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-12 rounded-card border border-gold-500/40 bg-black p-8 text-center">
        <h2 className="font-serif text-3xl text-ink-900">{a.visitTitle}</h2>
        <p className="mt-2 text-ink-500">{addressLine ?? t.item.showroom(cityState ?? "")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className="rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-black hover:bg-gold-400"
          >
            {a.shopNow}
          </Link>
          <WhatsAppButton variant="outline" label={t.whatsapp.bookVisit} message={t.whatsapp.msgVisit} />
        </div>
      </div>
    </div>
  );
}
