import prisma from "../../lib/prisma"
import { createClient } from "../../lib/supabase/server"

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  if (profile?.role !== "ADMIN") throw new Error("Forbidden: Admin only")
  return profile
}

export async function createStaffMember(
  email: string,
  fullName: string,
  phoneNumber: string,
  role: "ADMIN" | "SALES_AGENT" | "COACH" | "NUTRITIONIST",
) {
  await requireAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: Math.random().toString(36).slice(-12),
    email_confirm: true,
    user_metadata: { full_name: fullName, phoneNumber, role },
  })

  if (error) throw new Error(error.message)

  return await prisma.profile.create({
    data: { id: data.user.id, email, fullName, phoneNumber, role },
  })
}

export async function getStaffMembers() {
  return await prisma.profile.findMany({
    where: { role: { not: "CLIENT" } },
    orderBy: { createdAt: "desc" },
  })
}

export async function deleteStaffMember(profileId: string) {
  await requireAdmin()
  const supabase = await createClient()
  await supabase.auth.admin.deleteUser(profileId)
  await prisma.profile.delete({ where: { id: profileId } })
}
