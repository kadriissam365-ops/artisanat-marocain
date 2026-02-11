import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse } from "@/lib/api-utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const addItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99).default(1),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    const body = await request.json()
    const parsed = addItemSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400)
    }

    const { productId, quantity } = parsed.data

    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      select: { id: true, stock: true },
    })

    if (!product) {
      return errorResponse("Product not found", 404)
    }

    if (product.stock < quantity) {
      return errorResponse("Insufficient stock", 400)
    }

    const cart = await prisma.cart.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id },
      update: {},
    })

    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId: cart.id, productId },
      },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity: { increment: quantity } },
    })

    return jsonResponse({ cartItem }, 201)
  } catch (error) {
    console.error("POST /api/cart/items error:", error)
    return errorResponse("Internal server error", 500)
  }
}
