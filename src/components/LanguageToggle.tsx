"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { useT } from "@/lib/i18n/client";
import { LANG_COOKIE, type Lang } from "@/lib/i18n/dictionaries";

const OPTIONS: { value: Lang; label: string; name: string }[] = [
  { value: "es", label: "ES", name: "Español" },
  { value: "en", label: "EN", name: "English" },
];

/** Keeps the choice for a year and updates <html lang> for screen readers straight away. */
function remember(value: Lang) {
  document.cookie = `${LANG_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  document.documentElement.lang = value;
}

/**
 * ES | EN switch. The choice is kept in a cookie for a year, so the server
 * renders every page in that language from then on, then the current page
 * refreshes in place.
 */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, t } = useT();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const choose = (value: Lang) => {
    if (value === lang) return;
    remember(value);
    startTransition(() => router.refresh());
  };

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={`inline-flex items-center rounded-full border border-ink-300 p-0.5 ${
        pending ? "opacity-60" : ""
      } ${className}`}
    >
      {OPTIONS.map((option) => {
        const active = option.value === lang;
        return (
          <button
            key={option.value}
            type="button"
            lang={option.value}
            aria-pressed={active}
            title={option.name}
            onClick={() => choose(option.value)}
            className={`rounded-full px-2.5 py-1.5 text-[0.7rem] font-semibold tracking-[0.14em] transition-colors ${
              active ? "bg-gold-500 text-black" : "text-ink-600 hover:text-ink-900"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
