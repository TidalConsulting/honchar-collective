import type { Metadata } from "next";
import Link from "next/link";

import { LayawayCalculator } from "@/components/LayawayCalculator";
import { LeadForm } from "@/components/LeadForm";
import { PageIntro } from "@/components/PageIntro";
import { LAYAWAY_DEFAULTS, LAYAWAY_MIN_PRICE } from "@/lib/finance";
import { formatPrice } from "@/lib/format";
import { getT } from "@/lib/i18n/server";
import { getInventoryStats } from "@/lib/items";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.layaway.metaTitle, description: t.layaway.metaDescription };
}

export const dynamic = "force-dynamic";

export default async function LayawayPage() {
  const [stats, { t }] = await Promise.all([getInventoryStats(), getT()]);
  const l = t.layaway;
  const samplePrice = stats.startingPrice > 0 ? Math.max(Math.round(stats.startingPrice * 3), 1200) : 1800;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <PageIntro eyebrow={l.eyebrow} title={l.title}>
        <p>{l.lede}</p>
      </PageIntro>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {l.perks(LAYAWAY_DEFAULTS.depositPercent).map((entry) => (
          <div key={entry.title} className="rounded-card border border-ink-200 bg-surface p-6">
            <h2 className="font-serif text-xl text-gold-300">{entry.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{entry.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <LayawayCalculator price={samplePrice} editablePrice />

        <div className="space-y-6">
          <div className="rounded-card border border-ink-200 bg-surface p-6">
            <LeadForm
              type="LAYAWAY"
              heading={l.formHeading}
              subheading={l.formSub}
              messageLabel={l.formLabel}
              messagePlaceholder={l.formPlaceholder}
              submitLabel={l.formSubmit}
              defaultMessage=""
            />
          </div>

          <div className="rounded-card border border-ink-200 bg-surface p-6">
            <h2 className="font-serif text-xl text-ink-900">{l.fineTitle}</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              {l.fine(formatPrice(LAYAWAY_MIN_PRICE)).map((entry) => (
                <li key={entry} className="flex gap-2.5">
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" fill="none">
                    <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {entry}
                </li>
              ))}
            </ul>
            <Link
              href="/shop"
              className="mt-5 inline-flex rounded-full border border-gold-500 px-5 py-2.5 text-sm font-semibold text-gold-300 hover:bg-gold-500 hover:text-black"
            >
              {l.browse}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
