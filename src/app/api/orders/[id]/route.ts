import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse } from "@/lib/api-utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                slug: true,
                images: {
                  where: { isPrimary: true },
                  take: 1,
                  select: { url: true, alt: true, width: true, height: true },
                },
              },
            },
          },
        },
        shippingAddress: true,
      },
    })

    if (!order || order.userId !== session.user.id) {
      return errorResponse("Order not found", 404)
    }

    return jsonResponse({ order })
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error)
    return errorResponse("Internal server error", 500)
  }
}
