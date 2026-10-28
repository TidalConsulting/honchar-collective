import Link from "next/link";

import { Logo } from "@/components/Logo";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { label } from "@/lib/i18n/dictionaries";
import { getT } from "@/lib/i18n/server";
import { CATEGORIES, addressLine, cityState, site } from "@/lib/site";

export async function SiteFooter() {
  const { t } = await getT();
  return (
    <footer className="mt-24 border-t border-gold-500/30 bg-black text-ink-600">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-500">{t.meta.description}</p>
          <WhatsAppButton variant="outline" label={t.whatsapp.short} className="mt-5" />
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-500">{t.footer.shop}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATEGORIES.slice(0, 7).map((category) => (
              <li key={category}>
                <Link
                  href={`/shop?category=${encodeURIComponent(category)}`}
                  className="text-ink-500 transition-colors hover:text-ink-900"
                >
                  {label(t.category, category)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/shop" className="font-semibold text-ink-900 hover:text-gold-300">
                {t.footer.shopAll}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-500">
            {t.footer.services}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              { href: "/request", label: t.footer.requestUs },
              { href: "/layaway", label: t.footer.layaway },
              { href: "/about", label: t.footer.about(site.name) },
              { href: "/contact", label: t.footer.contact },
              { href: "/admin", label: t.footer.staff },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-500 transition-colors hover:text-ink-900">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-500">
            {site.address ? t.footer.visit : t.footer.touch}
          </h2>
          <address className="mt-4 space-y-1 text-sm not-italic text-ink-500">
            <div>{addressLine ?? `${cityState} · ${t.footer.byAppointment}`}</div>
            <a href={`mailto:${site.email}`} className="mt-2 inline-block hover:text-ink-900">
              {site.email}
            </a>
            <div>
              <a
                href={`https://instagram.com/${site.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink-900"
              >
                Instagram @{site.instagram}
              </a>
            </div>
          </address>
          <dl className="mt-5 space-y-1.5 text-sm">
            {site.hours.map((entry) => (
              <div key={entry.days} className="flex justify-between gap-4">
                <dt className="text-ink-500">{label(t.hours, entry.days)}</dt>
                <dd className="font-medium text-ink-800">{label(t.hours, entry.time)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="border-t border-ink-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              © {new Date().getFullYear()} {site.name}. {t.footer.rights}
            </span>
            <Link href="/privacy" className="font-medium text-ink-500 hover:text-ink-900">
              {t.footer.privacy}
            </Link>
          </p>
          <p className="max-w-2xl">
            {t.footer.disclaimer(site.name)}
          </p>
        </div>
      </div>
    </footer>
  );
}
