import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getT } from "@/lib/i18n/server";

export default async function NotFound() {
  const { t } = await getT();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="max-w-lg text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-gold-500">
            {t.notFound.eyebrow}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-ink-900 sm:text-5xl">
            {t.notFound.title}
          </h1>
          <p className="mt-3 text-ink-600">
            {t.notFound.body}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black hover:bg-gold-400"
            >
              {t.notFound.shop}
            </Link>
            <Link
              href="/request"
              className="rounded-full border border-ink-300 px-6 py-3 text-sm font-semibold text-ink-800 hover:bg-ink-100"
            >
              {t.notFound.request}
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
