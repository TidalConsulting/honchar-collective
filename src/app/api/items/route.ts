import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { itemCardSelect } from "@/lib/items";

/** Used by the saved-items page, which keeps its list in localStorage. */
export async function GET(request: Request) {
  const ids = (new URL(request.url).searchParams.get("ids") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 60);

  if (ids.length === 0) return NextResponse.json({ items: [] });

  const items = await prisma.item.findMany({
    where: { id: { in: ids }, status: { in: ["PUBLISHED", "SOLD"] } },
    select: itemCardSelect,
  });

  // Preserve the order the shopper saved them in.
  const order = new Map(ids.map((id, index) => [id, index]));
  items.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

  return NextResponse.json({ items });
}
