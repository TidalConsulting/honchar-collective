"use client";

import { useState } from "react";

export function DeleteItemButton({
  id,
  action,
}: {
  id: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-full border border-red-900 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-950/40"
      >
        Delete item
      </button>
    );
  }

  return (
    <form action={action} className="flex items-center gap-2 rounded-full bg-red-950/40 px-3 py-2">
      <input type="hidden" name="id" value={id} />
      <span className="text-sm font-semibold text-red-300">Delete permanently?</span>
      <button
        type="submit"
        className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
      >
        Yes, delete
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-full border border-ink-300 bg-surface px-4 py-2 text-sm font-semibold text-ink-700"
      >
        Cancel
      </button>
    </form>
  );
}
