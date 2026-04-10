import prisma from "../lib/prisma"
import { Subscription } from "../app/generated/prisma"

export async function generateAccessCode(userId: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()

  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24)

  const accessRecord = await prisma.accessCode.create({
    data: {
      code,
      profileId: userId,
      expiresAt,
    },
  })

  return accessRecord.code
}

export async function verifyGymAccess(inputCode: string) {
  const record = await prisma.accessCode.findUnique({
    where: { code: inputCode },
    include: {
      profile: {
        include: {
          subscriptions: true,
        },
      },
    },
  })

  if (!record) return { valid: false, message: "Code not found" }
  if (record.isUsed) return { valid: false, message: "Code already used" }
  if (new Date() > record.expiresAt) return { valid: false, message: "Code already expired" }

  const hasActiveSub = record.profile.subscriptions.some(
    (sub: Subscription) => sub.status === "ACTIVE"
  )

  if (!hasActiveSub) return { valid: false, message: "No active gym subscription" }

  await prisma.accessCode.update({
    where: { id: record.id },
    data: { isUsed: true },
  })

  return {
    valid: true,
    user: record.profile.fullName,
    role: record.profile.role,
  }
}
