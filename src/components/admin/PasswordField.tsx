"use client";

import { useId, useState } from "react";

import { FIELD, LABEL } from "@/components/admin/fieldStyles";

/**
 * A password box with a show/hide toggle.
 *
 * The eye is open while the password is readable and closed while it's dots,
 * so the icon shows the current state rather than the action — it reads the
 * way a person describes it: "the eye is open, so I can see it."
 *
 * The toggle sits outside the <label> (wired up with htmlFor instead of
 * wrapping) because a button inside a label gets the label's click forwarded
 * to it as well, which makes the press ambiguous.
 */
export function PasswordField({
  name,
  label,
  required,
  autoComplete,
  hint,
}: {
  name: string;
  label: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
}) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required={required}
          autoComplete={autoComplete}
          className={`${FIELD} border-ink-300 pr-12`}
        />
        <button
          type="button"
          onClick={() => setVisible((shown) => !shown)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-ink-500 transition-colors hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold-500"
        >
          {visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </button>
      </div>

      {hint && <span className="mt-1 block text-xs text-ink-500">{hint}</span>}
    </div>
  );
}

function EyeOpenIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M2.5 12S6.2 5.8 12 5.8 21.5 12 21.5 12 17.8 18.2 12 18.2 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.9" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      {/* A shut lid with lashes rather than a struck-through eye — "closed" is
          what the state actually is. The arc is deep and the lashes long so
          this carries the same visual weight as the open eye; drawn smaller it
          reads as a stray squiggle next to it. */}
      <path
        d="M2.6 8.8Q12 18.4 21.4 8.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.4 11.6 3.5 14.9M9.2 14 8.3 17.6M14.8 14l.9 3.6M18.6 11.6l1.9 3.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
