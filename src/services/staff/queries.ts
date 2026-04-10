import prisma from "../../lib/prisma"

export async function getStaffMembers() {
  return await prisma.profile.findMany({
    where: { role: { in: ["ADMIN", "SALES_AGENT", "COACH", "NUTRITIONIST"] } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getStaffAttendance(date?: Date) {
  const target = date ?? new Date()
  const start = new Date(target)
  start.setHours(0, 0, 0, 0)
  const end = new Date(target)
  end.setHours(23, 59, 59, 999)

  return await prisma.attendance.findMany({
    where: { date: { gte: start, lte: end } },
    include: { staff: { select: { fullName: true, role: true } } },
    orderBy: { checkIn: "asc" },
  })
}

export async function getActiveRoster() {
  return await prisma.roster.findFirst({
    where: { status: "PUBLISHED" },
    include: {
      shifts: {
        include: { staff: { select: { fullName: true, role: true } } },
        orderBy: { day: "asc" },
      },
    },
    orderBy: { weekStart: "desc" },
  })
}

export async function getAllRosters() {
  return await prisma.roster.findMany({
    include: { _count: { select: { shifts: true } } },
    orderBy: { weekStart: "desc" },
  })
}

export async function getRosterById(rosterId: string) {
  return await prisma.roster.findUnique({
    where: { id: rosterId },
    include: {
      shifts: {
        include: { staff: { select: { id: true, fullName: true, role: true } } },
        orderBy: [{ day: "asc" }, { shift: "asc" }],
      },
    },
  })
}
