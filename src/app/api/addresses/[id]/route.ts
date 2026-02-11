import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse } from "@/lib/api-utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const updateAddressSchema = z.object({
  label: z.string().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  company: z.string().optional(),
  street: z.string().min(1).optional(),
  street2: z.string().optional(),
  city: z.string().min(1).optional(),
  state: z.string().optional(),
  postalCode: z.string().min(1).optional(),
  country: z.string().length(2).optional(),
  phone: z.string().min(1).optional(),
  isDefault: z.boolean().optional(),
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
    const parsed = updateAddressSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400)
    }

    const existing = await prisma.address.findUnique({ where: { id } })
    if (!existing || existing.userId !== session.user.id) {
      return errorResponse("Address not found", 404)
    }

    if (parsed.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.update({
      where: { id },
      data: parsed.data,
    })

    return jsonResponse({ address })
  } catch (error) {
    console.error("PUT /api/addresses/[id] error:", error)
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

    const existing = await prisma.address.findUnique({ where: { id } })
    if (!existing || existing.userId !== session.user.id) {
      return errorResponse("Address not found", 404)
    }

    await prisma.address.delete({ where: { id } })

    return jsonResponse({ success: true })
  } catch (error) {
    console.error("DELETE /api/addresses/[id] error:", error)
    return errorResponse("Internal server error", 500)
  }
}
