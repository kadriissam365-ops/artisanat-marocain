import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse } from "@/lib/api-utils"
import { requireAdmin } from "@/lib/admin"
import { generateSlug } from "@/lib/utils"
import { z } from "zod"

const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().min(1),
  shortDescription: z.string().optional(),
  priceMad: z.number().positive(),
  priceEur: z.number().positive(),
  compareAtPriceMad: z.number().positive().optional(),
  compareAtPriceEur: z.number().positive().optional(),
  sku: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  artisan: z.string().min(1),
  origin: z.string().min(1),
  materials: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.number().positive(),
  categoryId: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
})

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const body = await request.json()
    const parsed = createProductSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400)
    }

    const slug = parsed.data.slug || generateSlug(parsed.data.name)

    const existingSlug = await prisma.product.findUnique({
      where: { slug },
    })
    if (existingSlug) {
      return errorResponse(`Le slug "${slug}" est deja utilise. Veuillez en choisir un autre.`, 409)
    }

    const product = await prisma.product.create({
      data: {
        ...parsed.data,
        slug,
        publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null,
      },
      include: {
        category: { select: { name: true, slug: true } },
        images: true,
      },
    })

    return jsonResponse({ product }, 201)
  } catch (err) {
    console.error("POST /api/admin/products error:", err)
    return errorResponse("Internal server error", 500)
  }
}
