import prisma from "../../lib/prisma"

export async function getDashboardStats() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [activeMembers, activeSubscriptions, pendingOrders, revenue, newMembersThisMonth, newSubsThisMonth] = await Promise.all([
    prisma.profile.count({ where: { role: "CLIENT" } }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"] } },
      _sum: { finalAmount: true },
    }),
    prisma.profile.count({ where: { role: "CLIENT", createdAt: { gte: startOfMonth } } }),
    prisma.subscription.count({ where: { status: "ACTIVE", createdAt: { gte: startOfMonth } } }),
  ])

  return {
    activeMembers,
    activeSubscriptions,
    pendingOrders,
    totalRevenue: Number(revenue._sum.finalAmount ?? 0),
    newMembersThisMonth,
    newSubsThisMonth,
  }
}

export async function getExpiringSoonSubscriptions(days = 10) {
  const now = new Date()
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() + days)

  return prisma.subscription.findMany({
    where: { status: "ACTIVE", endDate: { gte: now, lte: cutoff } },
    include: { profile: { select: { fullName: true } } },
    orderBy: { endDate: "asc" },
    take: 8,
  })
}

export async function getSubscriptionDistribution() {
  const groups = await prisma.subscription.groupBy({
    by: ["type"],
    where: { status: "ACTIVE" },
    _count: { type: true },
  })
  return groups.map((g) => ({ name: g.type, value: g._count.type }))
}

export async function getProductDistribution() {
  const groups = await prisma.product.groupBy({
    by: ["category"],
    where: { isActive: true },
    _count: { category: true },
  })
  return groups.map((g) => ({ name: g.category, value: g._count.category }))
}

export async function getRecentActivity(limit = 8) {
  const [orders, subscriptions] = await Promise.all([
    prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { client: { select: { fullName: true } } },
    }),
    prisma.subscription.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { profile: { select: { fullName: true } } },
    }),
  ])

  type ActivityItem = { text: string; detail: string; type: string; time: Date }
  const items: ActivityItem[] = [
    ...orders.map((o) => ({
      text: `Order ${o.status.toLowerCase()}`,
      detail: o.client.fullName,
      type: "Order",
      time: o.createdAt,
    })),
    ...subscriptions.map((s) => ({
      text: s.status === "ACTIVE" ? "Subscription activated" : `Subscription ${s.status.toLowerCase()}`,
      detail: `${s.profile.fullName} — ${s.type}`,
      type: "Subscription",
      time: s.createdAt,
    })),
  ]

  return items
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, limit)
    .map((item) => ({
      ...item,
      time: item.time.toISOString(),
    }))
}

async function getMonthlyData(
  fetcher: (start: Date, end: Date) => Promise<number>
): Promise<{ label: string; value: number }[]> {
  const now = new Date()
  const months = []
  for (let i = 11; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end   = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)
    months.push({
      label: start.toLocaleString("en-GB", { month: "short" }),
      value: await fetcher(start, end),
    })
  }
  return months
}

export async function getMonthlyRevenue() {
  return getMonthlyData(async (start, end) => {
    const r = await prisma.order.aggregate({
      where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"] }, createdAt: { gte: start, lte: end } },
      _sum: { finalAmount: true },
    })
    return Number(r._sum.finalAmount ?? 0)
  })
}

export async function getMonthlyMembers() {
  return getMonthlyData(async (_start, end) =>
    prisma.profile.count({ where: { role: "CLIENT", createdAt: { lte: end } } })
  )
}

export async function getMonthlySubscriptions() {
  return getMonthlyData(async (_start, end) =>
    prisma.subscription.count({ where: { status: "ACTIVE", createdAt: { lte: end } } })
  )
}

export async function getMonthlyOrders() {
  return getMonthlyData(async (start, end) =>
    prisma.order.count({ where: { status: { not: "CANCELLED" }, createdAt: { gte: start, lte: end } } })
  )
}
