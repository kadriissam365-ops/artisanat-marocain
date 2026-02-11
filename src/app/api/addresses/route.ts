import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse } from "@/lib/api-utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const addressSchema = z.object({
  label: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  street: z.string().min(1, "Street is required"),
  street2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().length(2, "Country must be a 2-letter ISO code").default("MA"),
  phone: z.string().min(1, "Phone is required"),
  isDefault: z.boolean().default(false),
})

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401)
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    })

    return jsonResponse({ addresses })
  } catch (error) {
    console.error("GET /api/addresses error:", error)
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
    const parsed = addressSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400)
    }

    if (parsed.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        ...parsed.data,
      },
    })

    return jsonResponse({ address }, 201)
  } catch (error) {
    console.error("POST /api/addresses error:", error)
    return errorResponse("Internal server error", 500)
  }
}
