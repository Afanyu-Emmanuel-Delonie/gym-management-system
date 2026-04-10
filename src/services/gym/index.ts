import prisma from "../../lib/prisma"

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

export async function bookSchedule(scheduleId: string, clientId: string) {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: { _count: { select: { bookings: true } } },
  })

  if (!schedule) throw new Error("Schedule not found")
  if (schedule._count.bookings >= schedule.capacity) throw new Error("Schedule is full")

  return await prisma.booking.create({
    data: { scheduleId, clientId },
  })
}

export async function getClientBookings(clientId: string) {
  return await prisma.booking.findMany({
    where: { clientId },
    include: {
      schedule: {
        include: { activity: true, coach: { select: { fullName: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}
