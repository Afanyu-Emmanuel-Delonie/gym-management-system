import { revalidatePath } from "next/cache"
import prisma from "../../lib/prisma"
import { createClient } from "../../lib/supabase/server"
import { ShiftType, AttendanceStatus } from "../../generated/prisma/client.ts"

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  if (profile?.role !== "ADMIN") throw new Error("Forbidden: Admin only")
  return profile
}

// ─── Staff ───────────────────────────────────────────────────

export async function createStaffMember(data: {
  email: string
  fullName: string
  phoneNumber?: string
  role: "SALES_AGENT" | "COACH" | "NUTRITIONIST"
}) {
  await requireAdmin()
  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.admin.createUser({
    email: data.email,
    password: Math.random().toString(36).slice(-12),
    email_confirm: true,
    user_metadata: { full_name: data.fullName, role: data.role },
  })

  if (error) throw new Error(error.message)

  const staff = await prisma.profile.create({
    data: { id: authData.user.id, email: data.email, fullName: data.fullName, phoneNumber: data.phoneNumber, role: data.role },
  })

  revalidatePath("/admin/staff")
  return staff
}

export async function deleteStaffMember(profileId: string) {
  await requireAdmin()
  const supabase = await createClient()
  await supabase.auth.admin.deleteUser(profileId)
  await prisma.profile.delete({ where: { id: profileId } })
  revalidatePath("/admin/staff")
}

// ─── Roster ──────────────────────────────────────────────────

export async function createRoster(weekStart: Date) {
  await requireAdmin()
  const roster = await prisma.roster.create({ data: { weekStart } })
  revalidatePath("/admin/staff")
  return roster
}

export async function addRosterShift(data: {
  rosterId: string
  staffId: string
  day: number
  shift: ShiftType
  startTime: string
  endTime: string
  note?: string
}) {
  await requireAdmin()
  const shift = await prisma.rosterShift.create({ data })
  revalidatePath("/admin/staff")
  return shift
}

export async function updateRosterShift(shiftId: string, data: {
  shift?: ShiftType
  startTime?: string
  endTime?: string
  note?: string
}) {
  await requireAdmin()
  const shift = await prisma.rosterShift.update({ where: { id: shiftId }, data })
  revalidatePath("/admin/staff")
  return shift
}

export async function deleteRosterShift(shiftId: string) {
  await requireAdmin()
  await prisma.rosterShift.delete({ where: { id: shiftId } })
  revalidatePath("/admin/staff")
}

export async function publishRoster(rosterId: string) {
  await requireAdmin()
  const roster = await prisma.roster.update({ where: { id: rosterId }, data: { status: "PUBLISHED" } })
  revalidatePath("/admin/staff")
  return roster
}

// ─── Attendance ───────────────────────────────────────────────

export async function checkIn(staffId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const existing = await prisma.attendance.findFirst({
    where: { staffId, date: { gte: today } },
  })

  if (existing) throw new Error("Already checked in today")

  const attendance = await prisma.attendance.create({
    data: { staffId, date: new Date(), checkIn: new Date(), status: "PRESENT" },
  })

  revalidatePath("/admin/staff")
  return attendance
}

export async function checkOut(staffId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const record = await prisma.attendance.findFirst({
    where: { staffId, date: { gte: today }, checkOut: null },
  })

  if (!record) throw new Error("No active check-in found")

  const attendance = await prisma.attendance.update({
    where: { id: record.id },
    data: { checkOut: new Date() },
  })

  revalidatePath("/admin/staff")
  return attendance
}

export async function markAttendance(data: {
  staffId: string
  date: Date
  status: AttendanceStatus
  note?: string
}) {
  await requireAdmin()
  const attendance = await prisma.attendance.upsert({
    where: { id: (await prisma.attendance.findFirst({ where: { staffId: data.staffId, date: data.date } }))?.id ?? "" },
    update: { status: data.status, note: data.note },
    create: { ...data },
  })
  revalidatePath("/admin/staff")
  return attendance
}
