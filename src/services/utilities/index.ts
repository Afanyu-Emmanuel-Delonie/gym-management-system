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

// --- GYM SERVICES (Admin) ---

export async function createGymService(data: {
  name: string
  description: string
  icon?: string
  image?: string
  price?: number
  order?: number
}) {
  await requireAdmin()
  const service = await prisma.gymService.create({ data })
  revalidatePath("/")
  revalidatePath("/admin/services")
  return service
}

export async function updateGymService(
  serviceId: string,
  data: Partial<{
    name: string
    description: string
    icon: string
    image: string
    price: number
    isActive: boolean
    order: number
  }>,
) {
  await requireAdmin()
  const service = await prisma.gymService.update({ where: { id: serviceId }, data })
  revalidatePath("/")
  revalidatePath("/admin/services")
  return service
}

export async function deleteGymService(serviceId: string) {
  await requireAdmin()
  await prisma.gymService.delete({ where: { id: serviceId } })
  revalidatePath("/")
  revalidatePath("/admin/services")
}

export async function reorderGymServices(orderedIds: string[]) {
  await requireAdmin()
  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.gymService.update({ where: { id }, data: { order: index } })
    )
  )
  revalidatePath("/")
  revalidatePath("/admin/services")
}

// --- GYM SERVICES (Public) ---

export async function getGymServices() {
  return await prisma.gymService.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })
}

export async function getAllGymServices() {
  return await prisma.gymService.findMany({ orderBy: { order: "asc" } })
}

// --- TESTIMONIALS (Client) ---

export async function submitTestimonial(content: string, rating: number) {
  const user = await requireAuth()

  if (rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5")
  if (content.trim().length < 10) throw new Error("Testimonial must be at least 10 characters")

  // One pending/approved testimonial per user at a time
  const existing = await prisma.testimonial.findFirst({
    where: { profileId: user.id, isApproved: false },
  })
  if (existing) throw new Error("You already have a testimonial pending approval")

  return await prisma.testimonial.create({
    data: { profileId: user.id, content: content.trim(), rating },
  })
}

export async function deleteOwnTestimonial(testimonialId: string) {
  const user = await requireAuth()
  const testimonial = await prisma.testimonial.findUnique({ where: { id: testimonialId } })

  if (!testimonial) throw new Error("Testimonial not found")
  if (testimonial.profileId !== user.id) throw new Error("Forbidden")

  await prisma.testimonial.delete({ where: { id: testimonialId } })
}

// --- TESTIMONIALS (Admin) ---

export async function approveTestimonial(testimonialId: string) {
  await requireAdmin()
  const testimonial = await prisma.testimonial.update({
    where: { id: testimonialId },
    data: { isApproved: true },
  })
  revalidatePath("/")
  revalidatePath("/admin/testimonials")
  return testimonial
}

export async function deleteTestimonial(testimonialId: string) {
  await requireAdmin()
  await prisma.testimonial.delete({ where: { id: testimonialId } })
  revalidatePath("/")
  revalidatePath("/admin/testimonials")
}

// --- TESTIMONIALS (Public) ---

export async function getApprovedTestimonials() {
  return await prisma.testimonial.findMany({
    where: { isApproved: true },
    include: { profile: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getPendingTestimonials() {
  return await prisma.testimonial.findMany({
    where: { isApproved: false },
    include: { profile: { select: { fullName: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })
}
