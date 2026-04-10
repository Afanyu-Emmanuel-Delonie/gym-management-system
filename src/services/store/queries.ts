import prisma from "../../lib/prisma"

// --- PRODUCTS ---

export async function getProducts(filters?: { category?: string; isActive?: boolean }) {
  return await prisma.product.findMany({
    where: {
      ...(filters?.category ? { category: filters.category } : {}),
      isActive: filters?.isActive ?? true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getProductById(productId: string) {
  return await prisma.product.findUnique({ where: { id: productId } })
}

export async function getLowStockProducts(threshold = 5) {
  return await prisma.product.findMany({
    where: { stock: { lte: threshold }, isActive: true },
    orderBy: { stock: "asc" },
  })
}

export async function getProductCategories() {
  const products = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
  })
  return products.map((p) => p.category)
}

// --- DISCOUNTS ---

export async function getDiscounts() {
  return await prisma.discount.findMany({ orderBy: { createdAt: "desc" } })
}

export async function validateDiscountCode(code: string, orderTotal: number) {
  const discount = await prisma.discount.findUnique({ where: { code } })

  if (!discount || !discount.isActive) return { valid: false, message: "Invalid discount code" }
  if (discount.expiresAt && discount.expiresAt < new Date()) return { valid: false, message: "Discount code has expired" }
  if (discount.maxUses && discount.usedCount >= discount.maxUses) return { valid: false, message: "Discount code has reached its limit" }
  if (discount.minOrder && orderTotal < Number(discount.minOrder)) return { valid: false, message: `Minimum order of ${discount.minOrder} required` }

  const discountAmount = discount.type === "PERCENTAGE"
    ? (orderTotal * Number(discount.value)) / 100
    : Math.min(Number(discount.value), orderTotal)

  return {
    valid: true,
    discountAmount,
    finalAmount: Math.max(0, orderTotal - discountAmount),
    discount,
  }
}

// --- ORDERS ---

export async function getClientOrders(clientId: string) {
  return await prisma.order.findMany({
    where: { clientId },
    include: {
      items: { include: { product: { select: { name: true, image: true } } } },
      delivery: true,
      discount: { select: { code: true, type: true, value: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getAllOrders(status?: OrderStatus) {
  return await prisma.order.findMany({
    where: status ? { status } : undefined,
    include: {
      client: { select: { fullName: true, email: true, phoneNumber: true } },
      items: { include: { product: { select: { name: true } } } },
      delivery: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getOrderById(orderId: string) {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      client: { select: { fullName: true, email: true, phoneNumber: true } },
      items: { include: { product: { select: { name: true, image: true, price: true } } } },
      delivery: true,
      discount: true,
    },
  })
}

export async function getStoreStats() {
  const [totalOrders, pendingOrders, totalRevenue, lowStock] = await Promise.all([
    prisma.order.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"] } },
      _sum: { finalAmount: true },
    }),
    prisma.product.count({ where: { stock: { lte: 5 }, isActive: true } }),
  ])

  return {
    totalOrders,
    pendingOrders,
    totalRevenue: totalRevenue._sum.finalAmount ?? 0,
    lowStockProducts: lowStock,
  }
}

type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "COMPLETED" | "CANCELLED" | "REFUNDED"
