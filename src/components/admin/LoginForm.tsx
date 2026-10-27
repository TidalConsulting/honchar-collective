"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createFirstUser, signIn, type AuthState } from "@/app/actions/auth";
import { FIELD, LABEL } from "@/components/admin/fieldStyles";
import { PasswordField } from "@/components/admin/PasswordField";

const INITIAL: AuthState = {};

export function LoginForm({ firstRun }: { firstRun: boolean }) {
  const [state, formAction] = useActionState(firstRun ? createFirstUser : signIn, INITIAL);

  return (
    <form action={formAction} className="space-y-4">
      {firstRun && (
        <Field name="name" label="Your name" autoComplete="name" required />
      )}
      <Field name="email" label="Email" type="email" autoComplete="email" required />
      <PasswordField
        name="password"
        label="Password"
        autoComplete={firstRun ? "new-password" : "current-password"}
        hint={firstRun ? "At least 8 characters." : undefined}
        required
      />

      {state.error && (
        <p className="rounded-lg bg-red-950/40 px-3 py-2.5 text-sm font-medium text-red-400">
          {state.error}
        </p>
      )}

      <Submit label={firstRun ? "Create account & sign in" : "Sign in"} />
    </form>
  );
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-gold-500 px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-gold-400 disabled:opacity-60"
    >
      {pending ? "Working…" : label}
    </button>
  );
}

function Field({
  name,
  label,
  type = "text",
  autoComplete,
  required,
  hint,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className={`${FIELD} border-ink-300`}
      />
      {hint && <span className="mt-1 block text-xs text-ink-500">{hint}</span>}
    </label>
  );
}
