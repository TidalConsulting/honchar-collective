import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/Logo";
import { getCurrentUser, needsFirstUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Staff sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  const firstRun = await needsFirstUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
      <Link href="/" className="mb-8">
        <Logo />
      </Link>

      <div className="w-full max-w-md rounded-card border border-gold-500/30 bg-surface p-8 shadow-2xl">
        <h1 className="font-serif text-3xl text-ink-900">
          {firstRun ? "Set up your account" : "Staff sign in"}
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          {firstRun
            ? "No accounts exist yet. Create the owner account to start managing inventory."
            : "Sign in to add, edit, and remove inventory."}
        </p>

        <div className="mt-6">
          <LoginForm firstRun={firstRun} />
        </div>
      </div>

      <Link href="/" className="mt-8 text-sm font-semibold text-ink-400 hover:text-white">
        ← Back to the website
      </Link>
    </div>
  );
}
