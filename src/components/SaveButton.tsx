"use client";

import { useT } from "@/lib/i18n/client";
import { useSaved } from "@/lib/useSaved";

export function SaveButton({
  itemId,
  className = "",
  withLabel = false,
}: {
  itemId: string;
  className?: string;
  withLabel?: boolean;
}) {
  const { isSaved, toggle, ready } = useSaved();
  const { t } = useT();
  const saved = ready && isSaved(itemId);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(itemId);
      }}
      aria-pressed={saved}
      aria-label={saved ? t.card.unsave : t.card.save}
      className={
        withLabel
          ? `inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
              saved
                ? "border-gold-500 bg-gold-50 text-gold-700"
                : "border-ink-300 text-ink-700 hover:bg-ink-100"
            } ${className}`
          : `inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-ink-900 shadow-sm backdrop-blur transition hover:bg-black/80 ${className}`
      }
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill={saved ? "var(--color-gold-500)" : "none"}
        stroke={saved ? "var(--color-gold-500)" : "currentColor"}
        strokeWidth="1.9"
      >
        <path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13L12 20.3Z" strokeLinejoin="round" />
      </svg>
      {withLabel && <span>{saved ? t.card.savedLabel : t.card.saveLabel}</span>}
    </button>
  );
}
