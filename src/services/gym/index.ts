import { revalidatePath } from "next/cache"
import prisma from "../../lib/prisma"
import { createClient } from "../../lib/supabase/server"

// --- SECURITY ---

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  if (profile?.role !== "ADMIN") throw new Error("Forbidden: Admin only")
  return profile
}

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  return user
}

// --- ACTIVITIES (Admin) ---

export async function createActivity(name: string, description?: string) {
  await requireAdmin()
  const activity = await prisma.activity.create({ data: { name, description } })
  revalidatePath("/admin/gym")
  return activity
}

export async function deleteActivity(activityId: string) {
  await requireAdmin()
  await prisma.activity.delete({ where: { id: activityId } })
  revalidatePath("/admin/gym")
}

// --- SCHEDULES (Admin/Coach) ---

export async function createSchedule(data: {
  activityId: string
  coachId: string
  startTime: Date
  endTime: Date
  capacity?: number
}) {
  await requireAdmin()
  const schedule = await prisma.schedule.create({ data })
  revalidatePath("/coach/schedule")
  revalidatePath("/client/classes")
  return schedule
}

export async function deleteSchedule(scheduleId: string) {
  await requireAdmin()
  await prisma.schedule.delete({ where: { id: scheduleId } })
  revalidatePath("/coach/schedule")
  revalidatePath("/client/classes")
}

// --- SCHEDULES (Public) ---

export async function getSchedules() {
  return await prisma.schedule.findMany({
    include: {
      activity: true,
      coach: { select: { fullName: true } },
      _count: { select: { bookings: true } },
    },
    orderBy: { startTime: "asc" },
  })
}

export async function getCoachSchedules(coachId: string) {
  return await prisma.schedule.findMany({
    where: { coachId },
    include: {
      activity: true,
      _count: { select: { bookings: true } },
      bookings: { include: { client: { select: { fullName: true } } } },
    },
    orderBy: { startTime: "asc" },
  })
}

// --- BOOKINGS (Client) ---

export async function bookSchedule(scheduleId: string) {
  const user = await requireAuth()

  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: { _count: { select: { bookings: true } } },
  })

  if (!schedule) throw new Error("Schedule not found")
  if (schedule._count.bookings >= schedule.capacity) throw new Error("Schedule is full")

  const existing = await prisma.booking.findFirst({
    where: { scheduleId, clientId: user.id },
  })
  if (existing) throw new Error("You have already booked this class")

  const booking = await prisma.booking.create({
    data: { scheduleId, clientId: user.id },
  })

  revalidatePath("/client/classes")
  return booking
}

export async function cancelBooking(bookingId: string) {
  const user = await requireAuth()

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (!booking) throw new Error("Booking not found")
  if (booking.clientId !== user.id) throw new Error("Forbidden")

  await prisma.booking.delete({ where: { id: bookingId } })
  revalidatePath("/client/classes")
}

export async function getClientBookings() {
  const user = await requireAuth()

  return await prisma.booking.findMany({
    where: { clientId: user.id },
    include: {
      schedule: {
        include: { activity: true, coach: { select: { fullName: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getActivities() {
  return await prisma.activity.findMany({ orderBy: { name: "asc" } })
}
