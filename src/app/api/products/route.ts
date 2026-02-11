import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, publicCache, errorResponse, parsePagination } from "@/lib/api-utils"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const { page, limit, skip } = parsePagination(searchParams)

    const category = searchParams.get("category")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const artisan = searchParams.get("artisan")
    const origin = searchParams.get("origin")
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") || "desc"
    const search = searchParams.get("q")
    const currency = searchParams.get("currency") || "MAD"

    const priceField = currency === "EUR" ? "priceEur" : "priceMad"

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(category && {
        category: { slug: category },
      }),
      ...(minPrice && {
        [priceField]: { gte: new Prisma.Decimal(minPrice) },
      }),
      ...(maxPrice && {
        [priceField]: { lte: new Prisma.Decimal(maxPrice) },
      }),
      ...(artisan && {
        artisan: { contains: artisan, mode: "insensitive" as const },
      }),
      ...(origin && {
        origin: { contains: origin, mode: "insensitive" as const },
      }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
          { artisan: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [sort === "price" ? priceField : sort]: order as Prisma.SortOrder,
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          priceMad: true,
          priceEur: true,
          compareAtPriceMad: true,
          compareAtPriceEur: true,
          stock: true,
          artisan: true,
          origin: true,
          isFeatured: true,
          category: {
            select: { name: true, slug: true },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { url: true, alt: true, width: true, height: true, blurDataURL: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    return jsonResponse(
      {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      200,
      publicCache(900)
    )
  } catch (error) {
    console.error("GET /api/products error:", error)
    return errorResponse("Internal server error", 500)
  }
}
