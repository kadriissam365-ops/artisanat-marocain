import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  })
}

function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ART-${year}-${random}`
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err)
    return new Response("Webhook signature verification failed", { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status === "paid") {
      const { userId, shippingAddressId, currency } = session.metadata!
      const priceField = currency === "EUR" ? "priceEur" : "priceMad"

      try {
        const cart = await prisma.cart.findUnique({
          where: { userId },
          include: {
            items: {
              include: {
                product: {
                  select: { id: true, name: true, priceMad: true, priceEur: true },
                },
              },
            },
          },
        })

        if (!cart || cart.items.length === 0) {
          console.error("Webhook: Cart empty for user", userId)
          return new Response("OK", { status: 200 })
        }

        const subtotal = cart.items.reduce((sum, item) => {
          return sum + Number(item.product[priceField]) * item.quantity
        }, 0)

        await prisma.$transaction(async (tx) => {
          await tx.order.create({
            data: {
              orderNumber: generateOrderNumber(),
              userId,
              status: "CONFIRMED",
              currency: currency!,
              subtotal,
              shippingCost: 0,
              totalAmount: subtotal,
              shippingAddressId: shippingAddressId!,
              stripePaymentIntentId: session.payment_intent as string,
              stripeSessionId: session.id,
              paymentStatus: "PAID",
              paidAt: new Date(),
              items: {
                create: cart.items.map((item) => ({
                  productId: item.product.id,
                  productName: item.product.name,
                  quantity: item.quantity,
                  unitPrice: Number(item.product[priceField]),
                  currency: currency!,
                })),
              },
            },
          })

          for (const item of cart.items) {
            await tx.product.update({
              where: { id: item.product.id },
              data: { stock: { decrement: item.quantity } },
            })
          }

          await tx.cartItem.deleteMany({ where: { cartId: cart.id } })
        })
      } catch (error) {
        console.error("Webhook: Order creation failed:", error)
        return new Response("Order creation failed", { status: 500 })
      }
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge
    const paymentIntentId = charge.payment_intent as string

    if (paymentIntentId) {
      await prisma.order.updateMany({
        where: { stripePaymentIntentId: paymentIntentId },
        data: { paymentStatus: "REFUNDED", status: "REFUNDED" },
      })
    }
  }

  return new Response("OK", { status: 200 })
}
