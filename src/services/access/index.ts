import prisma from "../../lib/prisma"

export async function verifyGymAccess(inputCode: string) {
  const sub = await prisma.subscription.findUnique({
    where: { accessCode: inputCode },
    include: { profile: true },
  })

  if (!sub) return { valid: false, message: "Code not found" }
  if (sub.status === "CANCELLED") return { valid: false, message: "Subscription is cancelled" }

  // Auto-expire if endDate has passed
  if (sub.endDate && sub.endDate < new Date()) {
    if (sub.status !== "EXPIRED") {
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { status: "EXPIRED" },
      })
    }
    return { valid: false, message: "Subscription has expired" }
  }

  if (sub.status !== "ACTIVE") return { valid: false, message: "Subscription is not active" }

  return {
    valid: true,
    user: sub.profile.fullName,
    role: sub.profile.role,
    subscriptionType: sub.type,
    expiresAt: sub.endDate,
  }
}
