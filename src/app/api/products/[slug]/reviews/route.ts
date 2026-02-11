import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, publicCache, errorResponse, parsePagination } from "@/lib/api-utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  comment: z.string().max(2000).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = request.nextUrl
    const { page, limit, skip } = parsePagination(searchParams)

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!product) {
      return errorResponse("Product not found", 404)
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId: product.id, isApproved: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          rating: true,
          title: true,
          comment: true,
          isVerified: true,
          createdAt: true,
          user: { select: { firstName: true, lastName: true } },
        },
      }),
      prisma.review.count({
        where: { productId: product.id, isApproved: true },
      }),
    ])

    const aggregation = await prisma.review.aggregate({
      where: { productId: product.id, isApproved: true },
      _avg: { rating: true },
      _count: true,
    })

    return jsonResponse(
      {
        reviews,
        aggregateRating: {
          average: aggregation._avg.rating ? Math.round(aggregation._avg.rating * 10) / 10 : 0,
          count: aggregation._count,
        },
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
      200,
      publicCache(300)
    )
  } catch (error) {
    console.error("GET /api/products/[slug]/reviews error:", error)
    return errorResponse("Internal server error", 500)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    const { slug } = await params
    const body = await request.json()
    const parsed = createReviewSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400)
    }

    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      select: { id: true },
    })

    if (!product) {
      return errorResponse("Product not found", 404)
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: product.id,
        },
      },
    })

    if (existingReview) {
      return errorResponse("You have already reviewed this product", 409)
    }

    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: product.id,
        order: {
          userId: session.user.id,
          status: "DELIVERED",
        },
      },
    })

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId: product.id,
        rating: parsed.data.rating,
        title: parsed.data.title,
        comment: parsed.data.comment,
        isVerified: !!hasPurchased,
      },
    })

    return jsonResponse({ review }, 201)
  } catch (error) {
    console.error("POST /api/products/[slug]/reviews error:", error)
    return errorResponse("Internal server error", 500)
  }
}
