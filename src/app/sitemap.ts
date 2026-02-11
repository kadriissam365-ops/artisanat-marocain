import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://artisanat-marocain.ma";
  const locales = ["fr", "ar"];

  // Static pages
  const staticPages = [
    { path: "", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/boutique", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/blog", changeFrequency: "weekly" as const, priority: 0.7 },
  ];

  const staticUrls = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  );

  // Dynamic categories from database
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const categoryUrls = locales.flatMap((locale) =>
    categories.map((cat: { slug: string; updatedAt: Date }) => ({
      url: `${baseUrl}/${locale}/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  // Dynamic products from database (only active)
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true,
      category: { select: { slug: true } },
    },
  });

  const productUrls = locales.flatMap((locale) =>
    products.map((prod: { slug: string; updatedAt: Date; category: { slug: string } }) => ({
      url: `${baseUrl}/${locale}/${prod.category.slug}/${prod.slug}`,
      lastModified: prod.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
