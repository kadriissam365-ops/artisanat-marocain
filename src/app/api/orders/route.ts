import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse, parsePagination } from "@/lib/api-utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const createOrderSchema = z.object({
  shippingAddressId: z.string().min(1),
  currency: z.enum(["MAD", "EUR"]).default("MAD"),
  shippingMethod: z.string().optional(),
  notes: z.string().optional(),
})

function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ART-${year}-${random}`
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    const { searchParams } = request.nextUrl
    const { page, limit, skip } = parsePagination(searchParams)

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          currency: true,
          totalAmount: true,
          paymentStatus: true,
          createdAt: true,
          items: {
            select: {
              productName: true,
              quantity: true,
              unitPrice: true,
            },
          },
        },
      }),
      prisma.order.count({ where: { userId: session.user.id } }),
    ])

    return jsonResponse({
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("GET /api/orders error:", error)
    return errorResponse("Internal server error", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    const body = await request.json()
    const parsed = createOrderSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400)
    }

    const { shippingAddressId, currency, shippingMethod, notes } = parsed.data
    const priceField = currency === "EUR" ? "priceEur" : "priceMad"

    const address = await prisma.address.findUnique({ where: { id: shippingAddressId } })
    if (!address || address.userId !== session.user.id) {
      return errorResponse("Shipping address not found", 404)
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
                priceMad: true,
                priceEur: true,
                stock: true,
                isActive: true,
              },
            },
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      return errorResponse("Cart is empty", 400)
    }

    for (const item of cart.items) {
      if (!item.product.isActive) {
        return errorResponse(`Product "${item.product.name}" is no longer available`, 400)
      }
      if (item.product.stock < item.quantity) {
        return errorResponse(`Insufficient stock for "${item.product.name}"`, 400)
      }
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const price = Number(item.product[priceField])
      return sum + price * item.quantity
    }, 0)

    const shippingCost = 0
    const totalAmount = subtotal + shippingCost

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session.user.id,
          currency,
          subtotal,
          shippingCost,
          totalAmount,
          shippingAddressId,
          shippingMethod,
          notes,
          items: {
            create: cart.items.map((item) => ({
              productId: item.product.id,
              productName: item.product.name,
              quantity: item.quantity,
              unitPrice: Number(item.product[priceField]),
              currency,
            })),
          },
        },
        include: { items: true },
      })

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.product.id },
          data: { stock: { decrement: item.quantity } },
        })
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } })

      return newOrder
    })

    return jsonResponse({ order }, 201)
  } catch (error) {
    console.error("POST /api/orders error:", error)
    return errorResponse("Internal server error", 500)
  }
}
