import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/url";

export const dynamic = "force-dynamic";

/**
 * Lists every public page plus one entry per listed piece, so a new item
 * becomes discoverable by search engines as soon as it's published.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  const staticPages = [
    "",
    "/shop",
    "/layaway",
    "/request",
    "/about",
    "/contact",
    "/privacy",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/shop" ? ("daily" as const) : ("monthly" as const),
    // The privacy policy belongs in the sitemap — it's a real page Meta and
    // Google expect to find — but nobody is searching for it, so it sits at the
    // bottom rather than competing with the listings.
    priority: path === "" ? 1 : path === "/shop" ? 0.9 : path === "/privacy" ? 0.2 : 0.5,
  }));

  let items: { slug: string; updatedAt: Date }[] = [];
  try {
    items = await prisma.item.findMany({
      where: { status: { in: ["PUBLISHED", "SOLD"] } },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5000,
    });
  } catch {
    // A sitemap is not worth failing a page render over.
  }

  return [
    ...staticPages,
    ...items.map((item) => ({
      url: `${base}/shop/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
