import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse } from "@/lib/api-utils"
import { requireAdmin } from "@/lib/admin"
import { z } from "zod"

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  shortDescription: z.string().optional(),
  priceMad: z.number().positive().optional(),
  priceEur: z.number().positive().optional(),
  compareAtPriceMad: z.number().positive().nullable().optional(),
  compareAtPriceEur: z.number().positive().nullable().optional(),
  sku: z.string().nullable().optional(),
  stock: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  artisan: z.string().min(1).optional(),
  origin: z.string().min(1).optional(),
  materials: z.string().nullable().optional(),
  dimensions: z.string().nullable().optional(),
  weight: z.number().positive().optional(),
  categoryId: z.string().min(1).optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateProductSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400)
    }

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return errorResponse("Product not found", 404)
    }

    if (parsed.data.slug && parsed.data.slug !== existing.slug) {
      const slugTaken = await prisma.product.findUnique({ where: { slug: parsed.data.slug } })
      if (slugTaken) {
        return errorResponse(`Le slug "${parsed.data.slug}" est deja utilise. Veuillez en choisir un autre.`, 409)
      }
    }

    const data = {
      ...parsed.data,
      publishedAt: parsed.data.publishedAt !== undefined
        ? (parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null)
        : undefined,
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: { select: { name: true, slug: true } },
        images: true,
      },
    })

    return jsonResponse({ product })
  } catch (err) {
    console.error("PUT /api/admin/products/[id] error:", err)
    return errorResponse("Internal server error", 500)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { id } = await params

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return errorResponse("Product not found", 404)
    }

    await prisma.product.delete({ where: { id } })

    return jsonResponse({ success: true })
  } catch (err) {
    console.error("DELETE /api/admin/products/[id] error:", err)
    return errorResponse("Internal server error", 500)
  }
}
