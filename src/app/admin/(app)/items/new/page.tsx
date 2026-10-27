import Link from "next/link";

import { createItem } from "@/app/actions/items";
import { ItemForm } from "@/components/admin/ItemForm";

export const metadata = { title: "Add a piece" };

export default function NewItemPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin" className="text-sm font-semibold text-ink-600 hover:text-ink-900">
        ← Back to inventory
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
        Add a piece
      </h1>
      <p className="mt-1 text-ink-600">
        Only the starred fields are required — you can fill in the rest later.
      </p>

      <div className="mt-6">
        <ItemForm action={createItem} submitLabel="Add piece" />
      </div>
    </div>
  );
}
