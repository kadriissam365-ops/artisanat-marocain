import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse } from "@/lib/api-utils"
import { requireAdmin } from "@/lib/admin"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      totalUsers,
      revenueMAD,
      revenueEUR,
      recentOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({
        where: {
          isActive: true,
          stock: { lte: prisma.product.fields.lowStockThreshold },
        },
      }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.order.aggregate({
        where: { paymentStatus: "PAID", currency: "MAD" },
        _sum: { totalAmount: true },
      }),
      prisma.order.aggregate({
        where: { paymentStatus: "PAID", currency: "EUR" },
        _sum: { totalAmount: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          totalAmount: true,
          currency: true,
          createdAt: true,
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
    ])

    return jsonResponse({
      stats: {
        products: { total: totalProducts, active: activeProducts, lowStock: lowStockProducts },
        orders: { total: totalOrders, pending: pendingOrders },
        users: { total: totalUsers },
        revenue: {
          mad: revenueMAD._sum.totalAmount || 0,
          eur: revenueEUR._sum.totalAmount || 0,
        },
      },
      recentOrders,
    })
  } catch (err) {
    console.error("GET /api/admin/stats error:", err)
    return errorResponse("Internal server error", 500)
  }
}
