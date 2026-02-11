import { prisma } from "@/lib/prisma"
import { jsonResponse, publicCache } from "@/lib/api-utils"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        priceMad: true,
        priceEur: true,
        compareAtPriceMad: true,
        compareAtPriceEur: true,
        artisan: true,
        origin: true,
        category: { select: { name: true, slug: true } },
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true, alt: true, width: true, height: true, blurDataURL: true },
        },
      },
    })

    return jsonResponse({ products }, 200, publicCache(3600))
  } catch (error) {
    console.error("GET /api/products/featured error:", error)
    return jsonResponse({ error: "Internal server error" }, 500)
  }
}
