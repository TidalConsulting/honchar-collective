import type { Metadata } from "next";
import Link from "next/link";

import { LayawayCalculator } from "@/components/LayawayCalculator";
import { LeadForm } from "@/components/LeadForm";
import { PageIntro } from "@/components/PageIntro";
import { LAYAWAY_DEFAULTS, LAYAWAY_MIN_PRICE } from "@/lib/finance";
import { getInventoryStats } from "@/lib/items";

export const metadata: Metadata = {
  title: "Layaway",
  description:
    "Reserve a luxury piece with a deposit and pay the balance in interest-free instalments. No credit check.",
};

export const dynamic = "force-dynamic";

export default async function LayawayPage() {
  const stats = await getInventoryStats();
  const samplePrice = stats.startingPrice > 0 ? Math.max(Math.round(stats.startingPrice * 3), 1200) : 1800;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <PageIntro eyebrow="Layaway · Apartado" title="Make it yours now. Pay for it over time.">
        <p>
          Put down a deposit and the piece is taken off the site and held for you. Pay the balance
          in equal instalments, weekly, every two weeks, or monthly, and take it home with the last
          one. No interest and no credit check.
        </p>
      </PageIntro>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {[
          {
            title: `${LAYAWAY_DEFAULTS.depositPercent}% holds it`,
            body: "Your deposit takes the piece off the site the same day. Nobody else can buy it.",
          },
          {
            title: "Zero interest",
            body: "You pay the price on the tag and nothing more. Split it into as many as 8 payments.",
          },
          {
            title: "Kept safe for you",
            body: "Stored and insured in our showroom until the final payment, then delivered or collected.",
          },
        ].map((entry) => (
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
              heading="Start a layaway"
              subheading="Tell us which piece and the plan that suits you. We'll confirm it on WhatsApp."
              messageLabel="Which piece, and which plan?"
              messagePlaceholder="e.g. the Gucci Marmont, 30% down and 4 payments every two weeks."
              submitLabel="Request layaway"
              defaultMessage=""
            />
          </div>

          <div className="rounded-card border border-ink-200 bg-surface p-6">
            <h2 className="font-serif text-xl text-ink-900">The fine print</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              {[
                `Layaway is available on pieces from $${LAYAWAY_MIN_PRICE.toLocaleString()}.`,
                "Plans run up to 4 months. Pay ahead at any time.",
                "Miss a payment and we'll message you first. After 14 days late the piece may be released.",
                "Deposits can be moved to a different piece within 7 days.",
              ].map((entry) => (
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
              Browse the collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
