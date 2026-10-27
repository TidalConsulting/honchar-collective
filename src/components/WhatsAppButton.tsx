"use client";

import { trackContact } from "@/components/VisitTracker";
import { whatsappHref } from "@/lib/site";

/**
 * The main way customers reach the boutique. Opens WhatsApp with a message
 * already written (which piece, and a link to it), and records the tap so the
 * dashboard can count it alongside form enquiries.
 */
export function WhatsAppButton({
  message,
  label = "Message us on WhatsApp",
  itemId,
  variant = "solid",
  className = "",
}: {
  message?: string;
  label?: string;
  /** For the Meta pixel, so a WhatsApp conversation counts against the right piece. */
  itemId?: string;
  variant?: "solid" | "outline" | "compact";
  className?: string;
}) {
  const style =
    variant === "solid"
      ? "bg-gold-500 px-5 py-3.5 text-sm text-black hover:bg-gold-400"
      : variant === "outline"
        ? "border border-gold-500 px-5 py-3 text-sm text-gold-300 hover:bg-gold-500 hover:text-black"
        : "border border-ink-300 px-4 py-2 text-xs text-ink-800 hover:border-gold-500 hover:text-gold-300";

  return (
    <a
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackContact("whatsapp");
        window.fbq?.("track", "Contact", itemId ? { content_ids: [itemId] } : {});
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-[0.14em] transition-colors ${style} ${className}`}
    >
      <WhatsAppIcon className={variant === "compact" ? "h-4 w-4" : "h-5 w-5"} />
      {label}
    </a>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.2 21.8l4.9-1.3A9.8 9.8 0 1 0 12 2.2Zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.5 2.5 0 0 0 1.7-1.2 2 2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}
