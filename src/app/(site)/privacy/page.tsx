import type { Metadata } from "next";
import Link from "next/link";

import { addressLine, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} handles information collected through this website.`,
};

/**
 * Written from what the site actually does rather than from a template: the
 * enquiry forms, the first-party visit counter, the saved-pieces list in the
 * browser, and the Meta and Google tags. If any of those change, this page is
 * the thing that has to change with them.
 */
const UPDATED = "October 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="font-serif text-4xl text-ink-900 sm:text-5xl">Privacy Policy</h1>
      <p className="mt-3 text-ink-600">
        Last updated {UPDATED}. This covers {site.name}&apos;s website.
      </p>

      <div className="mt-10 space-y-10">
        <Section title="The short version">
          <p>
            We collect what you send us through a form, and we measure which pieces get
            looked at so we know what to stock. We don&apos;t sell your information to
            anyone. We do use Facebook and Google advertising tools, which means some
            information about your visit is shared with them — the sections below say
            exactly what.
          </p>
        </Section>

        <Section title="What you give us">
          <p>
            When you send an enquiry, ask about layaway, or ask us to find a piece, we
            collect the <strong>name, WhatsApp or phone number, email address</strong> (whichever
            you give) and{" "}
            <strong>message</strong> you type, along with which item you were looking at.
          </p>
          <p>
            We use it to reply to you, usually on WhatsApp, and to talk about the piece. It
            goes to our staff by email and to a private team notification channel. We keep
            enquiries so we can follow up and keep track of a conversation — ask us and we
            will delete yours.
          </p>
        </Section>

        <Section title="What we measure ourselves">
          <p>
            We count visits so we know which pieces people are interested in. We record the
            pages viewed, how long each was open, which item a page was about,
            whether you tapped a WhatsApp or call button, and whether you arrived from a search engine, a social network, an ad, or by typing
            the address in.
          </p>
          <p>
            This part uses <strong>no cookies</strong>. It uses a random session number held
            by your browser only until you close the tab, and it does not record your IP
            address or build a fingerprint of your device. If you arrive from a search
            engine we keep only the site&apos;s name, never the words you searched for.
          </p>
        </Section>

        <Section title="Saved pieces">
          <p>
            Tapping the heart on a listing saves it in your own browser&apos;s storage. That
            list stays on your device, is never sent to us, and clearing your browser data
            removes it.
          </p>
        </Section>

        <Section title="Advertising: Facebook and Google">
          <p>
            We advertise on Facebook, Instagram and Google, and we use their measurement
            tools to see which ads actually bring people to the shop. These are the parts of
            this site that do use cookies.
          </p>
          <p>
            The <strong>Meta Pixel</strong> (Facebook) and the <strong>Google Ads tag</strong>{" "}
            record the pages you visit here and which items you open, so we can measure
            our ads and show them again to people who looked at a piece.
          </p>
          <p>
            When you send us an enquiry, we also report that to Meta from our own server so
            the count is accurate. That report includes your{" "}
            <strong>email address, phone number and name converted into a scrambled code
            (a one-way hash)</strong> that Meta can match against its own records but which
            cannot be turned back into your details, together with your IP address, browser
            type, and Facebook&apos;s own cookie identifiers if you have them.
          </p>
          <p>
            Meta and Google handle that information under their own policies, not ours. You
            can limit it through{" "}
            <a
              href="https://www.facebook.com/settings?tab=ads"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold-500 hover:underline"
            >
              your Facebook ad settings
            </a>{" "}
            and{" "}
            <a
              href="https://myadcenter.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold-500 hover:underline"
            >
              Google&apos;s My Ad Center
            </a>
            , and most browsers can block these tags outright.
          </p>
        </Section>

        <Section title="Who else sees it">
          <p>
            The companies that run this site for us: our web host, our database provider,
            our image storage, and the services that deliver enquiry notifications to our
            team. They process information on our behalf and nothing more.
          </p>
          <p>
            <strong>We do not sell your personal information, and we never have.</strong> We
            share it only as described here, or where the law requires it.
          </p>
        </Section>

        <Section title="Your choices">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Ask us for a copy of what we hold about you, or ask us to delete it — email{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-gold-500 hover:underline"
              >
                {site.email}
              </a>
              .
            </li>
            <li>Turn on &ldquo;Do Not Track&rdquo; or a tracker blocker in your browser.</li>
            <li>Clear your browser&apos;s cookies and site data to reset everything above.</li>
            <li>Reply to any message from us asking us to stop contacting you, and we will.</li>
          </ul>
        </Section>

        <Section title="Children">
          <p>
            This site is meant for people buying and selling commercial items. We
            don&apos;t knowingly collect information from anyone under 18. If you believe a
            child has sent us something, email us and we will remove it.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If we change how any of this works, we will update this page and the date at
            the top. Significant changes will be obvious on the page rather than buried.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about any of this go to{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-gold-500 hover:underline"
            >
              {site.email}
            </a>{" "}
            or{" "}
            <a
              href={site.phoneHref}
              className="font-semibold text-gold-500 hover:underline"
            >
              {site.phone}
            </a>
            .
          </p>
          {addressLine && <p className="text-ink-600">{site.name}, {addressLine}</p>}
        </Section>
      </div>

      <div className="mt-12 border-t border-ink-200 pt-6">
        <Link href="/" className="text-sm font-semibold text-gold-500 hover:underline">
          ← Back to {site.name}
        </Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight text-ink-900">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink-600">{children}</div>
    </section>
  );
}
