"use server"

import { revalidatePath } from "next/cache"
import prisma from "../lib/prisma"
import { createClient } from "../lib/supabase/server"
import { serialize } from "../lib/serialize"

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  if (profile?.role !== "ADMIN") throw new Error("Forbidden")
  return profile
}

// ─── Gym Services ─────────────────────────────────────────────

export async function getGymServices() {
  return serialize(await prisma.gymService.findMany({ orderBy: { order: "asc" } }))
}

export async function createGymService(data: { name: string; description: string; price?: number }) {
  await requireAdmin()
  const count = await prisma.gymService.count()
  await prisma.gymService.create({ data: { ...data, order: count } })
  revalidatePath("/admin/content")
}

export async function updateGymService(id: string, data: { name?: string; description?: string; price?: number; isActive?: boolean }) {
  await requireAdmin()
  await prisma.gymService.update({ where: { id }, data })
  revalidatePath("/admin/content")
}

export async function deleteGymService(id: string) {
  await requireAdmin()
  await prisma.gymService.delete({ where: { id } })
  revalidatePath("/admin/content")
}

// ─── Testimonials ─────────────────────────────────────────────

export async function getTestimonials(page = 1, pageSize = 10, filter?: string) {
  const where = filter === "APPROVED" ? { isApproved: true } : filter === "PENDING" ? { isApproved: false } : {}
  const [data, total] = await Promise.all([
    prisma.testimonial.findMany({
      where,
      include: { profile: { select: { fullName: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.testimonial.count({ where }),
  ])
  return { data, total }
}

export async function approveTestimonial(id: string) {
  await requireAdmin()
  await prisma.testimonial.update({ where: { id }, data: { isApproved: true } })
  revalidatePath("/admin/content")
}

export async function deleteTestimonial(id: string) {
  await requireAdmin()
  await prisma.testimonial.delete({ where: { id } })
  revalidatePath("/admin/content")
}

// ─── Inquiries ────────────────────────────────────────────────

export async function getInquiries(page = 1, pageSize = 10, status?: string) {
  const where = status && status !== "ALL" ? { status: status as any } : {}
  const [data, total] = await Promise.all([
    prisma.contactInquiry.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.contactInquiry.count({ where }),
  ])
  return { data, total }
}

export async function markInquiryRead(id: string) {
  await prisma.contactInquiry.update({ where: { id }, data: { status: "READ" } })
  revalidatePath("/admin/content")
}
