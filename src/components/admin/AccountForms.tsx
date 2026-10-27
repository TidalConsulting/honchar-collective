"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { changePassword, createUser, type SimpleState } from "@/app/actions/admin";
import { FIELD, LABEL } from "@/components/admin/fieldStyles";
import { PasswordField } from "@/components/admin/PasswordField";

const INITIAL: SimpleState = {};

export function AccountForms({ canAddUsers }: { canAddUsers: boolean }) {
  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-2">
      {canAddUsers && <AddUserForm />}
      <ChangePasswordForm />
    </div>
  );
}

function AddUserForm() {
  const [state, formAction] = useActionState(createUser, INITIAL);

  return (
    <section className="rounded-card border border-ink-200 bg-surface p-6">
      <h2 className="text-lg font-bold text-ink-900">Add a team member</h2>
      <p className="mt-1 text-sm text-ink-600">
        They&apos;ll be able to add, edit, and remove inventory right away.
      </p>

      <form action={formAction} className="mt-5 space-y-4">
        <Field name="name" label="Name" required />
        <Field name="email" label="Email" type="email" required />
        <PasswordField
          name="password"
          label="Temporary password"
          required
          autoComplete="new-password"
          hint="At least 8 characters. They can change it after signing in."
        />

        <label className="block">
          <span className={LABEL}>Role</span>
          <select name="role" defaultValue="STAFF" className={`${FIELD} border-ink-300`}>
            <option value="STAFF">Staff — manage inventory and leads</option>
            <option value="OWNER">Owner — also manages the team</option>
          </select>
        </label>

        <Feedback state={state} />
        <Submit label="Add team member" />
      </form>
    </section>
  );
}

function ChangePasswordForm() {
  const [state, formAction] = useActionState(changePassword, INITIAL);

  return (
    <section className="rounded-card border border-ink-200 bg-surface p-6">
      <h2 className="text-lg font-bold text-ink-900">Change your password</h2>
      <p className="mt-1 text-sm text-ink-600">Updates the account you&apos;re signed in as.</p>

      <form action={formAction} className="mt-5 space-y-4">
        <PasswordField name="password" label="New password" required autoComplete="new-password" />
        <PasswordField
          name="confirm"
          label="Confirm new password"
          required
          autoComplete="new-password"
        />

        <Feedback state={state} />
        <Submit label="Update password" />
      </form>
    </section>
  );
}

function Feedback({ state }: { state: SimpleState }) {
  if (state.error) {
    return (
      <p className="rounded-lg bg-red-950/40 px-3 py-2.5 text-sm font-medium text-red-400">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p className="rounded-lg bg-emerald-950/40 px-3 py-2.5 text-sm font-medium text-emerald-300">
        {state.success}
      </p>
    );
  }
  return null;
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-gold-500 px-5 py-3 text-sm font-bold text-black hover:bg-gold-400 disabled:opacity-60"
    >
      {pending ? "Working…" : label}
    </button>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  hint,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  hint?: string;
  autoComplete?: string;
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
