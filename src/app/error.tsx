"use client";

import { useEffect } from "react";

import { useT } from "@/lib/i18n/client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useT();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="max-w-lg text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-gold-500">
          {t.error.eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink-900">
          {t.error.title}
        </h1>
        <p className="mt-3 text-ink-600">
          {t.error.body}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black hover:bg-gold-400"
        >
          {t.error.retry}
        </button>
        {error.digest && (
          <p className="mt-6 font-mono text-xs text-ink-400">{t.error.reference}: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
