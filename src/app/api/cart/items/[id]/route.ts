import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse } from "@/lib/api-utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const updateQuantitySchema = z.object({
  quantity: z.number().int().min(1).max(99),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    const { id } = await params
    const body = await request.json()
    const parsed = updateQuantitySchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400)
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: { select: { userId: true } },
        product: { select: { stock: true } },
      },
    })

    if (!cartItem || cartItem.cart.userId !== session.user.id) {
      return errorResponse("Cart item not found", 404)
    }

    if (cartItem.product.stock < parsed.data.quantity) {
      return errorResponse("Insufficient stock", 400)
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity: parsed.data.quantity },
    })

    return jsonResponse({ cartItem: updated })
  } catch (error) {
    console.error("PUT /api/cart/items/[id] error:", error)
    return errorResponse("Internal server error", 500)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    const { id } = await params

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: { cart: { select: { userId: true } } },
    })

    if (!cartItem || cartItem.cart.userId !== session.user.id) {
      return errorResponse("Cart item not found", 404)
    }

    await prisma.cartItem.delete({ where: { id } })

    return jsonResponse({ success: true })
  } catch (error) {
    console.error("DELETE /api/cart/items/[id] error:", error)
    return errorResponse("Internal server error", 500)
  }
}
