"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { submitLead, type LeadFormState } from "@/app/actions/leads";
import { useT } from "@/lib/i18n/client";

const INITIAL: LeadFormState = { status: "idle" };

export function LeadForm({
  itemId,
  type = "AVAILABILITY",
  heading,
  subheading,
  submitLabel,
  defaultMessage = "",
  messageLabel,
  messagePlaceholder,
  compact = false,
}: {
  itemId?: string;
  type?: "AVAILABILITY" | "LAYAWAY" | "SOURCING" | "GENERAL";
  heading?: string;
  subheading?: string;
  submitLabel?: string;
  defaultMessage?: string;
  /**
   * The same form runs on contact, layaway, an item page, and sourcing
   * requests. The default suits someone asking about a listed piece; the
   * sourcing page overrides it to ask what they want found in the US.
   */
  messageLabel?: string;
  messagePlaceholder?: string;
  compact?: boolean;
}) {
  const [state, formAction] = useActionState(submitLead, INITIAL);
  const { lang, t } = useT();

  // Reported only once the server has actually saved the enquiry, and under
  // the id it came back with, so Meta can match this against the same event
  // sent server-side rather than counting the lead twice.
  const reported = useRef<string | null>(null);
  useEffect(() => {
    if (state.status !== "success" || !state.eventId) return;
    if (reported.current === state.eventId) return;
    reported.current = state.eventId;
    window.fbq?.("track", "Lead", {}, { eventID: state.eventId });
  }, [state.status, state.eventId]);

  if (state.status === "success") {
    return (
      <div className="rounded-card border border-emerald-900 bg-emerald-950/40 p-6 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-black">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
            <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-3 font-serif text-xl text-emerald-200">{t.lead.sent}</h3>
        <p className="mt-1 text-sm text-emerald-300">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      {heading && <h3 className="font-serif text-xl text-ink-900">{heading}</h3>}
      {subheading && <p className="-mt-1 text-sm text-ink-600">{subheading}</p>}

      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="lang" value={lang} />
      {itemId && <input type="hidden" name="itemId" value={itemId} />}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={compact ? "space-y-3" : "grid gap-3 sm:grid-cols-2"}>
        <TextField name="name" label={t.lead.fullName} autoComplete="name" error={state.errors?.name} required />
        <TextField
          name="phone"
          label={t.lead.phone}
          type="tel"
          autoComplete="tel"
          error={state.errors?.phone}
        />
      </div>

      <TextField
        name="email"
        label={t.lead.email}
        type="email"
        autoComplete="email"
        error={state.errors?.email}
      />
      <p className="-mt-1.5 text-xs text-ink-500">{t.lead.either}</p>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink-800">
          {messageLabel ?? t.lead.messageLabel}
        </span>
        <textarea
          name="message"
          rows={3}
          defaultValue={defaultMessage}
          placeholder={messagePlaceholder ?? t.lead.messagePlaceholder}
          className="w-full rounded-lg border border-ink-300 bg-ink-50 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-gold-400"
        />
      </label>

      {state.status === "error" && state.message && (
        <p className="rounded-lg bg-red-950/40 px-3 py-2 text-sm font-medium text-red-400">
          {state.message}
        </p>
      )}

      <SubmitButton label={submitLabel ?? t.lead.check} />

      <p className="text-xs leading-relaxed text-ink-500">
        {t.lead.consent}
      </p>
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  const { t } = useT();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-black transition-colors hover:bg-gold-400 disabled:opacity-60"
    >
      {pending ? t.lead.sending : label}
    </button>
  );
}

function TextField({
  name,
  label,
  type = "text",
  autoComplete,
  error,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-ink-800">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-lg border bg-ink-50 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-gold-400 ${
          error ? "border-red-400" : "border-ink-300"
        }`}
      />
      {error && <span className="mt-1 block text-xs font-medium text-red-400">{error}</span>}
    </label>
  );
}
