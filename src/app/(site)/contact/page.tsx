import type { Metadata } from "next";

import { LeadForm } from "@/components/LeadForm";
import { PageIntro } from "@/components/PageIntro";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { addressLine, cityState, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `WhatsApp, call, or email ${site.name} in ${cityState}.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <PageIntro eyebrow="Contact" title="We're a message away.">
        <p>
          Questions about a piece, a size, or a delivery? WhatsApp is the fastest way to reach us.
          We answer every message ourselves.
        </p>
      </PageIntro>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-5">
          <div className="rounded-card border border-ink-200 bg-surface p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">WhatsApp</h2>
            <p className="mt-1 text-lg font-semibold text-ink-900">{site.phone}</p>
            <WhatsAppButton className="mt-4" />
          </div>
          <InfoCard title="Call" body={site.phone} href={site.phoneHref} />
          <InfoCard title="Email" body={site.email} href={`mailto:${site.email}`} />
          <InfoCard
            title="Instagram"
            body={`@${site.instagram}`}
            href={`https://instagram.com/${site.instagram}`}
          />
          <InfoCard title="Showroom" body={addressLine ?? `${cityState} · by appointment`} />

          <div className="rounded-card border border-ink-200 bg-surface p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Hours</h2>
            <dl className="mt-3 space-y-2 text-sm">
              {site.hours.map((entry) => (
                <div key={entry.days} className="flex justify-between gap-4">
                  <dt className="text-ink-600">{entry.days}</dt>
                  <dd className="font-semibold text-ink-900">{entry.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="rounded-card border border-ink-200 bg-surface p-6">
          <LeadForm
            type="GENERAL"
            heading="Send us a message"
            subheading="We reply within a few hours during opening hours."
            messagePlaceholder="Ask us anything: a piece, a size, delivery, or layaway."
            submitLabel="Send message"
          />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, body, href }: { title: string; body: string; href?: string }) {
  return (
    <div className="rounded-card border border-ink-200 bg-surface p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">{title}</h2>
      {href ? (
        <a
          href={href}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-1 block text-lg font-semibold text-ink-900 hover:text-gold-400"
        >
          {body}
        </a>
      ) : (
        <p className="mt-1 text-lg font-semibold text-ink-900">{body}</p>
      )}
    </div>
  );
}
