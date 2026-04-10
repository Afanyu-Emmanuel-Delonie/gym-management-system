import prisma from "../../lib/prisma"

export async function getPendingSubscriptions() {
  return await prisma.subscription.findMany({
    where: { status: "PENDING" },
    include: {
      profile: { select: { fullName: true, email: true, phoneNumber: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getActiveSubscriptions() {
  return await prisma.subscription.findMany({
    where: { status: "ACTIVE" },
    include: {
      profile: { select: { fullName: true, email: true } },
    },
    orderBy: { endDate: "asc" },
  })
}

export async function getSubscriptionStats() {
  const [pending, active, expired, cancelled] = await Promise.all([
    prisma.subscription.count({ where: { status: "PENDING" } }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.subscription.count({ where: { status: "EXPIRED" } }),
    prisma.subscription.count({ where: { status: "CANCELLED" } }),
  ])

  return { pending, active, expired, cancelled }
}

export async function getClientSubscriptions(userId: string) {
  return await prisma.subscription.findMany({
    where: { profileId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      type: true,
      status: true,
      startDate: true,
      endDate: true,
      createdAt: true,
    },
  })
}
