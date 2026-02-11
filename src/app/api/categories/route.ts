import { prisma } from "@/lib/prisma"
import { jsonResponse, publicCache } from "@/lib/api-utils"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { position: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        metaTitle: true,
        metaDescription: true,
        children: {
          where: { isActive: true },
          orderBy: { position: "asc" },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            image: true,
            _count: { select: { products: { where: { isActive: true } } } },
          },
        },
        _count: { select: { products: { where: { isActive: true } } } },
      },
    })

    return jsonResponse({ categories }, 200, publicCache(1800))
  } catch (error) {
    console.error("GET /api/categories error:", error)
    return jsonResponse({ error: "Internal server error" }, 500)
  }
}
