import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse } from "@/lib/api-utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"
import { z } from "zod"

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  })
}

const checkoutSchema = z.object({
  currency: z.enum(["MAD", "EUR"]).default("MAD"),
  shippingAddressId: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    const body = await request.json()
    const parsed = checkoutSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400)
    }

    const { currency, shippingAddressId } = parsed.data
    const priceField = currency === "EUR" ? "priceEur" : "priceMad"
    const stripeCurrency = currency === "EUR" ? "eur" : "mad"

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
                images: {
                  where: { isPrimary: true },
                  take: 1,
                  select: { url: true },
                },
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
      if (!item.product.isActive || item.product.stock < item.quantity) {
        return errorResponse(`Product "${item.product.name}" is unavailable or out of stock`, 400)
      }
    }

    let stripeCustomerId = (
      await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { stripeCustomerId: true, email: true },
      })
    )!

    const stripe = getStripe()

    if (!stripeCustomerId.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: stripeCustomerId.email,
        metadata: { userId: session.user.id },
      })
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customer.id },
      })
      stripeCustomerId.stripeCustomerId = customer.id
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.items.map((item) => ({
      price_data: {
        currency: stripeCurrency,
        product_data: {
          name: item.product.name,
          images: item.product.images[0]?.url ? [item.product.images[0].url] : [],
        },
        unit_amount: Math.round(Number(item.product[priceField]) * 100),
      },
      quantity: item.quantity,
    }))

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId.stripeCustomerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      metadata: {
        userId: session.user.id,
        shippingAddressId,
        currency,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    })

    return jsonResponse({ sessionUrl: checkoutSession.url })
  } catch (error) {
    console.error("POST /api/checkout error:", error)
    return errorResponse("Internal server error", 500)
  }
}
