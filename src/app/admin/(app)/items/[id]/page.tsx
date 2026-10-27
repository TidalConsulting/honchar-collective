import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteItem, updateItem } from "@/app/actions/items";
import { ItemForm } from "@/components/admin/ItemForm";
import { DeleteItemButton } from "@/components/admin/DeleteItemButton";
import { formatDateTime, itemTitle } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.item.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });

  if (!item) notFound();

  const action = updateItem.bind(null, item.id);

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin" className="text-sm font-semibold text-ink-600 hover:text-ink-900">
        ← Back to inventory
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            {itemTitle(item)}
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            Last updated {formatDateTime(item.updatedAt)}
            {item.status === "PUBLISHED" && (
              <>
                {" · "}
                <Link
                  href={`/shop/${item.slug}`}
                  target="_blank"
                  className="font-semibold text-gold-500 hover:underline"
                >
                  View on site ↗
                </Link>
              </>
            )}
          </p>
        </div>

        <DeleteItemButton id={item.id} action={deleteItem} />
      </div>

      <div className="mt-6">
        <ItemForm
          action={action}
          submitLabel="Save changes"
          item={{
            ...item,
            images: item.images.map((image) => ({
              url: image.url,
              alt: image.alt ?? undefined,
            })),
          }}
        />
      </div>
    </div>
  );
}
