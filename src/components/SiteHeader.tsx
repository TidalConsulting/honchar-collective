"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Logo } from "@/components/Logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useT } from "@/lib/i18n/client";
import { site } from "@/lib/site";
import { useSaved } from "@/lib/useSaved";

export function SiteHeader() {
  const pathname = usePathname();
  const { t } = useT();
  const NAV = [
    { href: "/shop", label: t.nav.shop },
    { href: "/shop?arrival=arriving", label: t.nav.arriving },
    { href: "/request", label: t.nav.request },
    { href: "/layaway", label: t.nav.layaway },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];
  const { ids, ready } = useSaved();
  // Tracking which route the menu was opened on closes it automatically on navigation.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-ink-50/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:h-24 lg:px-8">
        <Link href="/" aria-label={t.nav.home(site.name)}>
          <Logo />
        </Link>

        <nav className="ml-6 hidden items-center gap-0.5 xl:flex">
          {NAV.map((item) => {
            const active = item.href === "/shop" ? pathname.startsWith("/shop") : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-2.5 py-2 text-[0.74rem] font-medium uppercase tracking-[0.14em] transition-colors ${
                  active ? "text-gold-300" : "text-ink-600 hover:text-ink-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <LanguageToggle />
          <Link
            href="/saved"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-300 text-ink-800 transition-colors hover:border-gold-500 hover:text-gold-300"
            aria-label={ready && ids.length ? t.nav.savedCount(ids.length) : t.nav.saved}
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9">
              <path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13L12 20.3Z" strokeLinejoin="round" />
            </svg>
            {ready && ids.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[0.65rem] font-bold text-black tabular-nums">
                {ids.length}
              </span>
            )}
          </Link>
          <span className="hidden sm:block">
            <WhatsAppButton variant="compact" label={t.whatsapp.short} />
          </span>
          <Link
            href="/shop"
            className="hidden rounded-full bg-gold-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:bg-gold-400 md:inline-flex xl:hidden 2xl:inline-flex"
          >
            {t.nav.shopNow}
          </Link>
          <button
            type="button"
            onClick={() => setOpenedOn(open ? null : pathname)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-300 text-ink-800 xl:hidden"
            aria-expanded={open}
            aria-label={t.nav.menu}
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-200 bg-ink-50 xl:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-sm font-medium uppercase tracking-[0.16em] text-ink-800 hover:bg-ink-100"
              >
                {item.label}
              </Link>
            ))}
            <WhatsAppButton className="mt-3" />
          </nav>
        </div>
      )}
    </header>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
