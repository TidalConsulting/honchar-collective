"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { slugify, itemTitle } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { itemSchema, type ItemInput } from "@/lib/validation";

export type ItemFormState = {
  status: "idle" | "error";
  message?: string;
  errors?: Record<string, string>;
};

function readForm(formData: FormData) {
  const bool = (key: string) => formData.get(key) === "on" || formData.get(key) === "true";

  return {
    brand: formData.get("brand"),
    name: formData.get("name"),
    category: formData.get("category"),
    gender: formData.get("gender"),
    condition: formData.get("condition") || "EXCELLENT",

    price: formData.get("price"),
    retailPrice: formData.get("retailPrice"),
    costPrice: formData.get("costPrice"),
    importCost: formData.get("importCost"),

    sku: formData.get("sku"),
    serialNumber: formData.get("serialNumber"),

    size: formData.get("size"),
    color: formData.get("color"),
    material: formData.get("material"),
    hardware: formData.get("hardware"),
    year: formData.get("year"),

    authenticated: bool("authenticated"),
    authenticationNote: formData.get("authenticationNote"),

    description: formData.get("description"),
    includes: formData.getAll("includes").map(String),

    arrival: formData.get("arrival") || "IN_DR",
    arrivesAt: formData.get("arrivesAt") || undefined,

    status: formData.get("status") || "PUBLISHED",
    soldPrice: formData.get("soldPrice"),
    featured: bool("featured"),

    images: parseImages(formData.get("images")),
  };
}

function parseImages(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry) => entry && typeof entry.url === "string")
      .map((entry) => ({ url: String(entry.url), alt: entry.alt ? String(entry.alt) : undefined }));
  } catch {
    return [];
  }
}

function fieldErrors(issues: { path: (string | number | symbol)[]; message: string }[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}

/** Slugs stay unique and readable: "louis-vuitton-neverfull-mm-monogram". */
async function uniqueSlug(
  data: Pick<ItemInput, "brand" | "name" | "color">,
  currentId?: string,
) {
  const base = slugify([itemTitle(data), data.color].filter(Boolean).join(" ")) || "item";
  let candidate = base;
  let counter = 2;

  for (;;) {
    const existing = await prisma.item.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === currentId) return candidate;
    candidate = `${base}-${counter++}`;
  }
}

function toCreateData(data: ItemInput, slug: string) {
  const { images, ...rest } = data;
  const live = rest.status === "PUBLISHED";
  return {
    ...rest,
    slug,
    // Stamp the listing clock only once it's actually visible to shoppers.
    listedAt: live ? new Date() : null,
    originalPrice: live ? rest.price : null,
    soldPrice: rest.status === "SOLD" ? rest.soldPrice : null,
    soldAt: rest.status === "SOLD" ? new Date() : null,
    images: {
      create: images.map((image, index) => ({
        url: image.url,
        alt: image.alt ?? null,
        position: index,
      })),
    },
  };
}

export async function createItem(
  _prev: ItemFormState,
  formData: FormData,
): Promise<ItemFormState> {
  await requireUser();

  const parsed = itemSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      errors: fieldErrors(parsed.error.issues),
    };
  }

  const slug = await uniqueSlug(parsed.data);

  try {
    await prisma.item.create({ data: toCreateData(parsed.data, slug) });
  } catch (error) {
    return { status: "error", message: describeDbError(error) };
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  redirect("/admin?created=1");
}

export async function updateItem(
  itemId: string,
  _prev: ItemFormState,
  formData: FormData,
): Promise<ItemFormState> {
  await requireUser();

  const parsed = itemSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      errors: fieldErrors(parsed.error.issues),
    };
  }

  const existing = await prisma.item.findUnique({
    where: { id: itemId },
    select: {
      price: true,
      previousPrice: true,
      status: true,
      listedAt: true,
      originalPrice: true,
      soldAt: true,
      soldPrice: true,
    },
  });
  if (!existing) return { status: "error", message: "That item no longer exists." };

  const { images, ...rest } = parsed.data;
  const slug = await uniqueSlug(parsed.data, itemId);

  // Dropping the price records the old one so the listing shows a price-drop badge.
  const previousPrice =
    rest.price < existing.price ? existing.price : rest.price > existing.price ? null : existing.previousPrice;

  const goingLive = rest.status === "PUBLISHED" && !existing.listedAt;
  const goingSold = rest.status === "SOLD" && existing.status !== "SOLD";

  try {
    await prisma.$transaction([
      prisma.itemImage.deleteMany({ where: { itemId } }),
      prisma.item.update({
        where: { id: itemId },
        data: {
          ...rest,
          slug,
          previousPrice,
          // The listing clock starts the first time it goes live and is never reset.
          listedAt: goingLive ? new Date() : existing.listedAt,
          originalPrice: goingLive ? rest.price : (existing.originalPrice ?? null),
          soldAt: goingSold ? new Date() : existing.soldAt,
          // The final-sale-price box only renders while the status is Sold, so
          // an edit made in any other status submits nothing for it. Taking
          // that as "clear it" would quietly erase the sale figure — and the
          // margin reporting built on it — every time someone relisted a piece
          // and then fixed a typo. Only a save made *as* Sold can change it.
          soldPrice: rest.status === "SOLD" ? rest.soldPrice : existing.soldPrice,
          images: {
            create: images.map((image, index) => ({
              url: image.url,
              alt: image.alt ?? null,
              position: index,
            })),
          },
        },
      }),
    ]);
  } catch (error) {
    return { status: "error", message: describeDbError(error) };
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${slug}`);
  revalidatePath("/admin");
  redirect("/admin?updated=1");
}

export async function deleteItem(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.item.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  redirect("/admin?deleted=1");
}

/** Quick status flips from the inventory table (Publish / Draft / Mark sold). */
export async function setItemStatus(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["DRAFT", "PUBLISHED", "SOLD"].includes(status)) return;

  const existing = await prisma.item.findUnique({
    where: { id },
    select: { price: true, status: true, listedAt: true, originalPrice: true, soldAt: true },
  });
  if (!existing) return;

  // An optional final sale price, captured when marking an item sold.
  const rawSold = String(formData.get("soldPrice") ?? "").replace(/[^0-9]/g, "");
  const soldPrice = rawSold ? Number(rawSold) : null;

  const goingLive = status === "PUBLISHED" && !existing.listedAt;
  const goingSold = status === "SOLD" && existing.status !== "SOLD";

  await prisma.item.update({
    where: { id },
    data: {
      status: status as "DRAFT" | "PUBLISHED" | "SOLD",
      listedAt: goingLive ? new Date() : existing.listedAt,
      originalPrice: goingLive ? existing.price : (existing.originalPrice ?? null),
      soldAt: goingSold ? new Date() : existing.soldAt,
      ...(soldPrice !== null && status === "SOLD" ? { soldPrice } : {}),
    },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
}

export async function toggleItemFeatured(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const item = await prisma.item.findUnique({ where: { id }, select: { featured: true } });
  if (!item) return;

  await prisma.item.update({ where: { id }, data: { featured: !item.featured } });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
}

/** Copies a listing so near-identical pieces (the same bag in two colours) can be added in seconds. */
export async function duplicateItem(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const source = await prisma.item.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });
  if (!source) return;

  const slug = await uniqueSlug(source);

  const copy = await prisma.item.create({
    data: {
      brand: source.brand,
      name: source.name,
      category: source.category,
      gender: source.gender,
      condition: source.condition,
      price: source.price,
      retailPrice: source.retailPrice,
      size: source.size,
      color: source.color,
      material: source.material,
      hardware: source.hardware,
      year: source.year,
      authenticated: false,
      authenticationNote: null,
      description: source.description,
      includes: source.includes,
      arrival: source.arrival,
      arrivesAt: source.arrivesAt,
      costPrice: source.costPrice,
      importCost: source.importCost,
      featured: false,
      slug,
      // A copy starts hidden, and identifiers that must stay unique are cleared.
      status: "DRAFT",
      // Authentication is per piece, never per listing, so a copy starts
      // unverified and with no serial until someone checks the new one.
      sku: source.sku ? `${source.sku}-COPY` : null,
      serialNumber: null,
      previousPrice: null,
      images: {
        create: source.images.map((image, index) => ({
          url: image.url,
          alt: image.alt,
          position: index,
        })),
      },
    },
  });

  revalidatePath("/admin");
  redirect(`/admin/items/${copy.id}`);
}

function describeDbError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("Unique constraint") && message.includes("sku")) {
    return "That SKU is already used by another item.";
  }
  return "Something went wrong saving this item. Please try again.";
}
