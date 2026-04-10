"use server"

import { revalidatePath } from "next/cache"
import prisma from "../lib/prisma"
import { SubscriptionType } from "../app/generated/prisma"

export async function createSubscriptionRequest(userId: string, type: SubscriptionType) {
  return await prisma.subscription.create({
    data: {
      profileId: userId,
      type,
      status: "PENDING",
    },
  })
}

export async function confirmSubscriptionPayment(subscriptionId: string) {
  const sub = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  })

  if (!sub) throw new Error("Subscription not found")

  const durationMap: Record<SubscriptionType, number> = {
    DAILY: 1,
    WEEKLY: 7,
    MONTHLY: 30,
    YEARLY: 365,
  }

  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(startDate.getDate() + durationMap[sub.type])

  const updatedSub = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: "ACTIVE",
      startDate,
      endDate,
      accessCode: Math.floor(100000 + Math.random() * 900000).toString(),
    },
  })

  revalidatePath("/agent/dashboard")
  return updatedSub
}

export async function getPendingSubscriptions() {
  return await prisma.subscription.findMany({
    where: { status: "PENDING" },
    include: {
      profile: {
        select: { fullName: true, email: true, phoneNumber: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}
