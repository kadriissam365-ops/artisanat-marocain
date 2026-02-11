import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, publicCache, errorResponse, parsePagination } from "@/lib/api-utils"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = request.nextUrl
    const { page, limit, skip } = parsePagination(searchParams)
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") || "desc"
    const currency = searchParams.get("currency") || "MAD"
    const priceField = currency === "EUR" ? "priceEur" : "priceMad"

    const category = await prisma.category.findUnique({
      where: { slug, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        metaTitle: true,
        metaDescription: true,
        parent: { select: { name: true, slug: true } },
        children: {
          where: { isActive: true },
          orderBy: { position: "asc" },
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            _count: { select: { products: { where: { isActive: true } } } },
          },
        },
      },
    })

    if (!category) {
      return errorResponse("Category not found", 404)
    }

    const where = {
      isActive: true,
      OR: [
        { categoryId: category.id },
        { category: { parentId: category.id } },
      ],
    }

    const orderBy = {
      [sort === "price" ? priceField : sort]: order,
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
          category: { select: { name: true, slug: true } },
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
        category,
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
    console.error("GET /api/categories/[slug] error:", error)
    return errorResponse("Internal server error", 500)
  }
}
