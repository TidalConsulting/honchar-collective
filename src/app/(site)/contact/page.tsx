import type { Metadata } from "next";

import { LeadForm } from "@/components/LeadForm";
import { PageIntro } from "@/components/PageIntro";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { label } from "@/lib/i18n/dictionaries";
import { getT } from "@/lib/i18n/server";
import { addressLine, cityState, site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.nav.contact, description: t.contact.metaDescription(site.name, cityState ?? "") };
}

export default async function ContactPage() {
  const { t } = await getT();
  const c = t.contact;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <PageIntro eyebrow={c.eyebrow} title={c.title}>
        <p>{c.lede}</p>
      </PageIntro>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-5">
          <div className="rounded-card border border-ink-200 bg-surface p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">WhatsApp</h2>
            <p className="mt-1 text-lg font-semibold text-ink-900">{site.phone}</p>
            <WhatsAppButton className="mt-4" />
          </div>
          <InfoCard title={c.call} body={site.phone} href={site.phoneHref} />
          <InfoCard title={c.email} body={site.email} href={`mailto:${site.email}`} />
          <InfoCard
            title="Instagram"
            body={`@${site.instagram}`}
            href={`https://instagram.com/${site.instagram}`}
          />
          <InfoCard title={c.showroom} body={addressLine ?? `${cityState} · ${t.footer.byAppointment}`} />

          <div className="rounded-card border border-ink-200 bg-surface p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">{c.hours}</h2>
            <dl className="mt-3 space-y-2 text-sm">
              {site.hours.map((entry) => (
                <div key={entry.days} className="flex justify-between gap-4">
                  <dt className="text-ink-600">{label(t.hours, entry.days)}</dt>
                  <dd className="font-semibold text-ink-900">{label(t.hours, entry.time)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="rounded-card border border-ink-200 bg-surface p-6">
          <LeadForm
            type="GENERAL"
            heading={c.formHeading}
            subheading={c.formSub}
            messagePlaceholder={c.formPlaceholder}
            submitLabel={c.formSubmit}
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
