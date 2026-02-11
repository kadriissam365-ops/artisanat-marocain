import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse, parsePagination } from "@/lib/api-utils"
import { requireAdmin } from "@/lib/admin"

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { searchParams } = request.nextUrl
    const { page, limit, skip } = parsePagination(searchParams)
    const status = searchParams.get("status")
    const paymentStatus = searchParams.get("paymentStatus")

    const where = {
      ...(status && { status: status as any }),
      ...(paymentStatus && { paymentStatus: paymentStatus as any }),
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: { select: { email: true, firstName: true, lastName: true } },
          items: {
            select: { productName: true, quantity: true, unitPrice: true, currency: true },
          },
          shippingAddress: {
            select: { city: true, country: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ])

    return jsonResponse({
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (err) {
    console.error("GET /api/admin/orders error:", err)
    return errorResponse("Internal server error", 500)
  }
}
