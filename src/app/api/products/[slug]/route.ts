import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, publicCache, errorResponse } from "@/lib/api-utils"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            parent: { select: { name: true, slug: true } },
          },
        },
        images: {
          orderBy: { position: "asc" },
          select: {
            id: true,
            url: true,
            alt: true,
            position: true,
            isPrimary: true,
            width: true,
            height: true,
            blurDataURL: true,
          },
        },
        reviews: {
          where: { isApproved: true },
          select: {
            id: true,
            rating: true,
            title: true,
            comment: true,
            createdAt: true,
            user: { select: { firstName: true, lastName: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!product) {
      return errorResponse("Product not found", 404)
    }

    // Compute aggregate rating for JSON-LD
    const approvedReviews = product.reviews
    const reviewCount = approvedReviews.length
    const averageRating =
      reviewCount > 0
        ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : null

    // Related products from same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        isActive: true,
        id: { not: product.id },
      },
      take: 4,
      orderBy: { createdAt: "desc" },
      select: {
        name: true,
        slug: true,
        priceMad: true,
        priceEur: true,
        artisan: true,
        category: { select: { slug: true } },
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true, alt: true, width: true, height: true, blurDataURL: true },
        },
      },
    })

    return jsonResponse(
      {
        ...product,
        aggregateRating: averageRating
          ? { ratingValue: Math.round(averageRating * 10) / 10, reviewCount }
          : null,
        relatedProducts,
      },
      200,
      publicCache(900)
    )
  } catch (error) {
    console.error("GET /api/products/[slug] error:", error)
    return errorResponse("Internal server error", 500)
  }
}
