import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse } from "@/lib/api-utils"
import { requireAdmin } from "@/lib/admin"
import { z } from "zod"

const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]),
  trackingNumber: z.string().optional(),
  adminNotes: z.string().optional(),
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
    const parsed = updateStatusSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400)
    }

    const existing = await prisma.order.findUnique({ where: { id } })
    if (!existing) {
      return errorResponse("Order not found", 404)
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: parsed.data.status,
        ...(parsed.data.trackingNumber && { trackingNumber: parsed.data.trackingNumber }),
        ...(parsed.data.adminNotes && { adminNotes: parsed.data.adminNotes }),
      },
    })

    return jsonResponse({ order })
  } catch (err) {
    console.error("PUT /api/admin/orders/[id]/status error:", err)
    return errorResponse("Internal server error", 500)
  }
}
