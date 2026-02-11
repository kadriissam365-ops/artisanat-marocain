import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse } from "@/lib/api-utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                priceMad: true,
                priceEur: true,
                stock: true,
                isActive: true,
                images: {
                  where: { isPrimary: true },
                  take: 1,
                  select: { url: true, alt: true, width: true, height: true, blurDataURL: true },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    return jsonResponse({ cart: cart || { items: [] } })
  } catch (error) {
    console.error("GET /api/cart error:", error)
    return errorResponse("Internal server error", 500)
  }
}
