"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useT } from "@/lib/i18n/client";
import { label } from "@/lib/i18n/dictionaries";
import { CATEGORIES } from "@/lib/site";

export function HeroSearch() {
  const router = useRouter();
  const { t } = useT();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    router.push(`/shop${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div>
      <form
        onSubmit={submit}
        className="flex flex-col gap-2 rounded-2xl border border-gold-500/40 bg-black/70 p-2 backdrop-blur sm:flex-row sm:items-center sm:rounded-full"
      >
        <label className="sr-only" htmlFor="hero-category">
          {t.search.category}
        </label>
        <select
          id="hero-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-xl border-0 bg-ink-100 px-4 py-3 text-sm font-medium text-ink-900 sm:rounded-full"
        >
          <option value="">{t.search.everything}</option>
          {CATEGORIES.map((entry) => (
            <option key={entry} value={entry}>
              {label(t.category, entry)}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="hero-query">
          {t.search.label}
        </label>
        <input
          id="hero-query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.search.placeholder}
          className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />

        <button
          type="submit"
          className="rounded-xl bg-gold-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:bg-gold-400 sm:rounded-full"
        >
          {t.search.submit}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink-500">
          {t.search.popular}
        </span>
        {t.search.quick.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:border-gold-400 hover:text-gold-300"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
