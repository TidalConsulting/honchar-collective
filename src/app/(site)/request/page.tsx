import type { Metadata } from "next";

import { LeadForm } from "@/components/LeadForm";
import { PageIntro } from "@/components/PageIntro";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getT } from "@/lib/i18n/server";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.request.metaTitle, description: t.request.metaDescription(site.name) };
}

export default async function RequestPage() {
  const { t } = await getT();
  const r = t.request;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <PageIntro eyebrow={r.eyebrow} title={r.title}>
            <p>{r.lede}</p>
          </PageIntro>

          <ol className="mt-10 space-y-6">
            {r.steps(site.shippingDays).map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-500 font-serif text-gold-400">
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-base font-semibold text-ink-900">{step.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-card border border-ink-200 bg-surface p-6">
            <h2 className="font-serif text-xl text-ink-900">{r.oftenTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{r.oftenBody}</p>
          </div>
        </div>

        <div className="space-y-5 lg:sticky lg:top-28">
          <div className="rounded-card border border-ink-200 bg-surface p-6">
            <WhatsAppButton className="w-full" label={t.whatsapp.screenshot} message={t.whatsapp.msgFind} />
          </div>
          <div className="rounded-card border border-ink-200 bg-surface p-6">
            <LeadForm
              type="SOURCING"
              heading={r.formHeading}
              subheading={r.formSub}
              messageLabel={t.lead.messageLabel}
              messagePlaceholder={r.formPlaceholder}
              submitLabel={r.formSubmit}
              defaultMessage=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
