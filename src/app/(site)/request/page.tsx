import type { Metadata } from "next";

import { LeadForm } from "@/components/LeadForm";
import { PageIntro } from "@/components/PageIntro";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request an Item",
  description: `Tell ${site.name} what you want. We find it in the United States, authenticate it, and deliver it to you in the Dominican Republic.`,
};

export default function RequestPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <PageIntro eyebrow="Personal sourcing" title="Tell us what you want. We'll bring it home.">
            <p>
              Looking for a specific bag, a size that never reaches the DR, or a sneaker that sold
              out here in an hour? We buy from boutiques, authorised resellers, and vetted private
              sellers in the United States, authenticate every piece, and ship it to you.
            </p>
          </PageIntro>

          <ol className="mt-10 space-y-6">
            {[
              {
                title: "Describe the piece",
                body: "Brand, model, size, colour, and your budget. A screenshot over WhatsApp works just as well.",
              },
              {
                title: "We find it and send you a quote",
                body: "One all-in price in dollars: the piece, shipping, and customs. No surprises at the door.",
              },
              {
                title: "Deposit, authenticate, ship",
                body: "A 30% deposit secures it. We authenticate it in the US before it ships, then again when it lands.",
              },
              {
                title: "Delivered to you",
                body: `Usually ${site.shippingDays} days from purchase to your door anywhere in the DR. Pay the balance on delivery.`,
              },
            ].map((step, index) => (
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
            <h2 className="font-serif text-xl text-ink-900">Often requested</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Louis Vuitton and Goyard totes, Chanel flap bags, Cartier Love and Juste un Clou,
              Rolex and Cartier watches, limited Jordan and Nike releases, Moncler outerwear, and
              Christian Louboutin heels in sizes 35–42.
            </p>
          </div>
        </div>

        <div className="space-y-5 lg:sticky lg:top-28">
          <div className="rounded-card border border-ink-200 bg-surface p-6">
            <WhatsAppButton
              className="w-full"
              label="Send a screenshot on WhatsApp"
              message="Hi! I'm looking for a piece. Can you help me find it?"
            />
          </div>
          <div className="rounded-card border border-ink-200 bg-surface p-6">
            <LeadForm
              type="SOURCING"
              heading="Request an item"
              subheading="We reply with availability and an all-in quote, usually within a day."
              messageLabel="What are you looking for?"
              messagePlaceholder="Brand, model, size, colour, condition you'd accept, and your budget."
              submitLabel="Find it for me"
              defaultMessage=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
