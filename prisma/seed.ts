import { createClient } from "@supabase/supabase-js"
import { PrismaClient } from "../src/generated/prisma/client.ts"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! })
const prisma = new PrismaClient({ adapter })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ─── Users ────────────────────────────────────────────────────
const STAFF_USERS = [
  { email: "admin@gym.com",   password: "GymAdmin@2025",  fullName: "Alex Mugisha",    role: "ADMIN",        phone: "+250 788 000 001" },
  { email: "agent@gym.com",   password: "GymAgent@2025",  fullName: "Sarah Uwase",     role: "SALES_AGENT",  phone: "+250 788 000 002" },
  { email: "agent2@gym.com",  password: "GymAgent@2025",  fullName: "Eric Habimana",   role: "SALES_AGENT",  phone: "+250 788 000 003" },
  { email: "coach@gym.com",   password: "GymCoach@2025",  fullName: "David Nkurunziza",role: "COACH",        phone: "+250 788 000 004" },
  { email: "coach2@gym.com",  password: "GymCoach@2025",  fullName: "Grace Mutoni",    role: "COACH",        phone: "+250 788 000 005" },
  { email: "nutri@gym.com",   password: "GymNutri@2025",  fullName: "Peter Ingabire",  role: "NUTRITIONIST", phone: "+250 788 000 006" },
]

const CLIENT_USERS = [
  { email: "alice@email.com",   fullName: "Alice Martin",     phone: "+250 700 100 001" },
  { email: "bob@email.com",     fullName: "Bob Kariuki",      phone: "+250 700 100 002" },
  { email: "claire@email.com",  fullName: "Claire Uwase",     phone: "+250 700 100 003" },
  { email: "david@email.com",   fullName: "David Nzeyimana",  phone: "+250 700 100 004" },
  { email: "eva@email.com",     fullName: "Eva Mutoni",       phone: "+250 700 100 005" },
  { email: "frank@email.com",   fullName: "Frank Mugisha",    phone: "+250 700 100 006" },
  { email: "grace@email.com",   fullName: "Grace Ingabire",   phone: "+250 700 100 007" },
  { email: "henry@email.com",   fullName: "Henry Bizimana",   phone: "+250 700 100 008" },
  { email: "irene@email.com",   fullName: "Irene Uwimana",    phone: "+250 700 100 009" },
  { email: "james@email.com",   fullName: "James Habimana",   phone: "+250 700 100 010" },
]

function daysAgo(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n); return d
}
function daysFromNow(n: number) {
  const d = new Date(); d.setDate(d.getDate() + n); return d
}
function randomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function seed() {
  console.log("🧹 Clearing database...")
  await prisma.attendance.deleteMany()
  await prisma.rosterShift.deleteMany()
  await prisma.roster.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.schedule.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.accessCode.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.delivery.deleteMany()
  await prisma.order.deleteMany()
  await prisma.discount.deleteMany()
  await prisma.product.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.contactInquiry.deleteMany()
  await prisma.gymService.deleteMany()
  await prisma.profile.deleteMany()

  const { data: { users: authUsers } } = await supabase.auth.admin.listUsers()
  for (const u of authUsers) await supabase.auth.admin.deleteUser(u.id)
  console.log("✔ Cleared\n")

  // ─── Staff ────────────────────────────────────────────────
  const staffProfiles: Record<string, string> = {}
  for (const u of STAFF_USERS) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email, password: u.password, email_confirm: true,
      user_metadata: { full_name: u.fullName, role: u.role },
    })
    if (error) { console.error(`✘ ${u.email}: ${error.message}`); continue }
    await prisma.profile.create({
      data: { id: data.user.id, email: u.email, fullName: u.fullName, role: u.role as any, phoneNumber: u.phone },
    })
    staffProfiles[u.role === "ADMIN" ? "admin" : u.email.split("@")[0]] = data.user.id
    console.log(`✔ Staff: ${u.email}`)
  }

  // ─── Clients ──────────────────────────────────────────────
  const clientIds: string[] = []
  for (const c of CLIENT_USERS) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: c.email, password: "Client@2025", email_confirm: true,
      user_metadata: { full_name: c.fullName, role: "CLIENT" },
    })
    if (error) { console.error(`✘ ${c.email}: ${error.message}`); continue }
    await prisma.profile.create({
      data: { id: data.user.id, email: c.email, fullName: c.fullName, role: "CLIENT", phoneNumber: c.phone },
    })
    clientIds.push(data.user.id)
    console.log(`✔ Client: ${c.email}`)
  }

  // ─── Subscriptions ────────────────────────────────────────
  const subData = [
    { idx: 0, type: "MONTHLY", status: "ACTIVE",    start: daysAgo(15),  end: daysFromNow(15) },
    { idx: 1, type: "WEEKLY",  status: "PENDING",   start: null,         end: null },
    { idx: 2, type: "YEARLY",  status: "ACTIVE",    start: daysAgo(60),  end: daysFromNow(305) },
    { idx: 3, type: "DAILY",   status: "EXPIRED",   start: daysAgo(10),  end: daysAgo(9) },
    { idx: 4, type: "MONTHLY", status: "CANCELLED", start: daysAgo(40),  end: daysAgo(10) },
    { idx: 5, type: "YEARLY",  status: "PENDING",   start: null,         end: null },
    { idx: 6, type: "MONTHLY", status: "ACTIVE",    start: daysAgo(5),   end: daysFromNow(25) },
    { idx: 7, type: "WEEKLY",  status: "ACTIVE",    start: daysAgo(2),   end: daysFromNow(5) },
    { idx: 8, type: "MONTHLY", status: "EXPIRED",   start: daysAgo(45),  end: daysAgo(15) },
    { idx: 9, type: "DAILY",   status: "ACTIVE",    start: new Date(),   end: daysFromNow(1) },
  ]
  for (const s of subData) {
    if (s.idx >= clientIds.length) continue
    await prisma.subscription.create({
      data: {
        profileId: clientIds[s.idx],
        type: s.type as any,
        status: s.status as any,
        accessCode: s.status === "ACTIVE" ? randomCode() : null,
        startDate: s.start,
        endDate: s.end,
      },
    })
  }
  console.log("✔ Subscriptions seeded")

  // ─── Products ─────────────────────────────────────────────
  const products = await Promise.all([
    prisma.product.create({ data: { name: "Whey Protein 1kg",    category: "Supplements", price: 45000, stock: 24, description: "High quality whey protein, 25g per serving. Chocolate & vanilla." } }),
    prisma.product.create({ data: { name: "Creatine 500g",       category: "Supplements", price: 32000, stock: 11, description: "Pure creatine monohydrate for strength and muscle gains." } }),
    prisma.product.create({ data: { name: "Gym Gloves",          category: "Accessories", price: 8500,  stock: 3,  description: "Padded gloves for better grip and wrist support." } }),
    prisma.product.create({ data: { name: "Resistance Bands Set",category: "Equipment",   price: 6500,  stock: 0,  isActive: false, description: "Set of 5 resistance bands for home and gym workouts." } }),
    prisma.product.create({ data: { name: "Training T-Shirt",    category: "Apparel",     price: 12000, stock: 18, description: "Moisture-wicking training t-shirt. S, M, L, XL." } }),
    prisma.product.create({ data: { name: "Gym Shorts",          category: "Apparel",     price: 9500,  stock: 7,  description: "Lightweight gym shorts with side pockets." } }),
    prisma.product.create({ data: { name: "Shaker Bottle",       category: "Accessories", price: 4500,  stock: 30, description: "600ml BPA-free shaker bottle with mixing ball." } }),
    prisma.product.create({ data: { name: "Pre-Workout 300g",    category: "Supplements", price: 38000, stock: 8,  description: "Energy and focus blend for intense training sessions." } }),
  ])
  console.log("✔ Products seeded")

  // ─── Discounts ────────────────────────────────────────────
  await prisma.discount.createMany({
    data: [
      { code: "GYM10",   type: "PERCENTAGE", value: 10,   minOrder: 20000, maxUses: 100, usedCount: 34, isActive: true,  expiresAt: new Date("2025-12-31") },
      { code: "FLAT5K",  type: "FIXED",      value: 5000, minOrder: null,  maxUses: 50,  usedCount: 50, isActive: false, expiresAt: new Date("2025-06-30") },
      { code: "WELCOME", type: "PERCENTAGE", value: 15,   minOrder: null,  maxUses: null,usedCount: 12, isActive: true },
      { code: "VIP20",   type: "PERCENTAGE", value: 20,   minOrder: 50000, maxUses: 20,  usedCount: 5,  isActive: true,  expiresAt: new Date("2025-09-30") },
    ],
  })
  console.log("✔ Discounts seeded")

  // ─── Orders ───────────────────────────────────────────────
  const orderData = [
    { idx: 0, items: [{ p: 0, qty: 1 }, { p: 2, qty: 1 }], status: "PENDING",    delivery: "PICKUP" },
    { idx: 1, items: [{ p: 0, qty: 2 }],                    status: "PAID",       delivery: "DELIVERY", address: "KG 123 St, Kigali" },
    { idx: 2, items: [{ p: 4, qty: 1 }, { p: 5, qty: 2 }], status: "PROCESSING", delivery: "PICKUP" },
    { idx: 3, items: [{ p: 7, qty: 1 }],                    status: "SHIPPED",    delivery: "DELIVERY", address: "KN 45 Ave, Kigali" },
    { idx: 4, items: [{ p: 1, qty: 1 }, { p: 6, qty: 2 }], status: "COMPLETED",  delivery: "PICKUP" },
    { idx: 5, items: [{ p: 2, qty: 1 }],                    status: "CANCELLED",  delivery: "PICKUP" },
    { idx: 6, items: [{ p: 0, qty: 1 }, { p: 7, qty: 1 }], status: "DELIVERED",  delivery: "DELIVERY", address: "KG 78 Rd, Kigali" },
  ]
  for (const o of orderData) {
    if (o.idx >= clientIds.length) continue
    let total = 0
    const itemsWithPrice = o.items.map((i) => {
      const price = Number(products[i.p].price)
      total += price * i.qty
      return { productId: products[i.p].id, quantity: i.qty, price }
    })
    const order = await prisma.order.create({
      data: {
        clientId: clientIds[o.idx],
        totalAmount: total,
        discountAmount: 0,
        finalAmount: total,
        status: o.status as any,
        deliveryType: o.delivery as any,
        deliveryAddress: (o as any).address ?? null,
        items: { create: itemsWithPrice },
      },
    })
    if (o.delivery === "DELIVERY" && (o as any).address) {
      await prisma.delivery.create({ data: { orderId: order.id, address: (o as any).address } })
    }
  }
  console.log("✔ Orders seeded")

  // ─── Gym Services ─────────────────────────────────────────
  await prisma.gymService.createMany({
    data: [
      { name: "Personal Training",  description: "One-on-one sessions with certified coaches.",    price: 50000, isActive: true,  order: 0 },
      { name: "Group Classes",      description: "High energy group fitness sessions.",             price: 15000, isActive: true,  order: 1 },
      { name: "Nutrition Coaching", description: "Personalised meal plans and dietary guidance.",   price: 40000, isActive: true,  order: 2 },
      { name: "Massage Therapy",    description: "Recovery and relaxation massage sessions.",       price: 30000, isActive: false, order: 3 },
      { name: "Body Assessment",    description: "Full body composition and fitness assessment.",   price: 10000, isActive: true,  order: 4 },
    ],
  })
  console.log("✔ Gym services seeded")

  // ─── Testimonials ─────────────────────────────────────────
  await prisma.testimonial.createMany({
    data: [
      { profileId: clientIds[0], content: "Best gym in town! The coaches are amazing and very professional.", rating: 5, isApproved: true },
      { profileId: clientIds[1], content: "Great equipment and very friendly staff. Highly recommend.", rating: 4, isApproved: true },
      { profileId: clientIds[2], content: "The nutrition coaching completely changed my lifestyle.", rating: 5, isApproved: false },
      { profileId: clientIds[3], content: "Good place but parking can be difficult sometimes.", rating: 3, isApproved: false },
      { profileId: clientIds[4], content: "Love the group classes, very motivating atmosphere!", rating: 5, isApproved: true },
    ],
  })
  console.log("✔ Testimonials seeded")

  // ─── Contact Inquiries ────────────────────────────────────
  await prisma.contactInquiry.createMany({
    data: [
      { name: "John Doe",       email: "john@email.com",   phone: "+250700111222", subject: "Membership pricing",       message: "Hi, I would like to know more about your monthly membership plans and what is included.", status: "UNREAD" },
      { name: "Mary Uwase",     email: "mary@email.com",   phone: null,            subject: "Personal training inquiry", message: "I am interested in personal training sessions. Can you tell me about availability and pricing?", status: "READ" },
      { name: "Peter Habimana", email: "peter@email.com",  phone: "+250700222333", subject: "Group classes schedule",    message: "Could you please share the weekly schedule for group fitness classes?", status: "REPLIED" },
      { name: "Grace Mutoni",   email: "grace2@email.com", phone: "+250700333444", subject: "Nutrition coaching",        message: "I have been struggling with my diet. Do you offer nutrition coaching and how much does it cost?", status: "UNREAD" },
      { name: "Eric Nzeyimana", email: "eric@email.com",   phone: null,            subject: "Gym equipment for sale",    message: "Do you sell gym equipment for home use? I am looking for resistance bands and dumbbells.", status: "READ" },
    ],
  })
  console.log("✔ Inquiries seeded")

  // ─── Activities & Schedules ───────────────────────────────
  const coachId = staffProfiles["coach"] ?? Object.values(staffProfiles)[3]
  const activities = await Promise.all([
    prisma.activity.create({ data: { name: "HIIT Training",   description: "High intensity interval training" } }),
    prisma.activity.create({ data: { name: "Yoga",            description: "Flexibility and mindfulness" } }),
    prisma.activity.create({ data: { name: "Strength Class",  description: "Barbell and dumbbell strength work" } }),
    prisma.activity.create({ data: { name: "Cardio Blast",    description: "Cardio endurance session" } }),
  ])
  if (coachId) {
    for (let i = 0; i < activities.length; i++) {
      await prisma.schedule.create({
        data: {
          activityId: activities[i].id,
          coachId,
          startTime: daysFromNow(i + 1),
          endTime: new Date(daysFromNow(i + 1).getTime() + 60 * 60 * 1000),
          capacity: 20,
        },
      })
    }
  }
  console.log("✔ Activities & schedules seeded")

  // ─── Roster ───────────────────────────────────────────────
  const monday = new Date()
  monday.setDate(monday.getDate() - monday.getDay() + 1)
  monday.setHours(0, 0, 0, 0)

  const roster = await prisma.roster.create({ data: { weekStart: monday, status: "PUBLISHED" } })

  const staffForRoster = STAFF_USERS.filter((u) => u.role !== "ADMIN")
  const staffProfileRows = await prisma.profile.findMany({
    where: { email: { in: staffForRoster.map((u) => u.email) } },
  })

  const shiftAssignments = [
    { email: "agent@gym.com",  shifts: [0,1,2,3,4] },
    { email: "agent2@gym.com", shifts: [0,1,2,3,4] },
    { email: "coach@gym.com",  shifts: [1,2,3,4,5] },
    { email: "coach2@gym.com", shifts: [0,2,4,6] },
    { email: "nutri@gym.com",  shifts: [1,3,5] },
  ]

  for (const assignment of shiftAssignments) {
    const profile = staffProfileRows.find((p) => p.email === assignment.email)
    if (!profile) continue
    for (const day of assignment.shifts) {
      const shiftType = day % 2 === 0 ? "MORNING" : "EVENING"
      await prisma.rosterShift.create({
        data: {
          rosterId: roster.id,
          staffId: profile.id,
          day,
          shift: shiftType as any,
          startTime: shiftType === "MORNING" ? "06:00" : "14:00",
          endTime:   shiftType === "MORNING" ? "14:00" : "22:00",
        },
      })
    }
  }
  console.log("✔ Roster seeded")

  // ─── Attendance ───────────────────────────────────────────
  const today = new Date(); today.setHours(0, 0, 0, 0)
  for (const profile of staffProfileRows.slice(0, 4)) {
    const checkIn = new Date(today); checkIn.setHours(6, Math.floor(Math.random() * 15), 0)
    const checkOut = new Date(today); checkOut.setHours(14, Math.floor(Math.random() * 15), 0)
    await prisma.attendance.create({
      data: {
        staffId: profile.id,
        date: today,
        checkIn,
        checkOut: profile === staffProfileRows[0] ? null : checkOut,
        status: "PRESENT",
      },
    })
  }
  // One late, one absent
  if (staffProfileRows[4]) {
    const lateIn = new Date(today); lateIn.setHours(8, 30, 0)
    await prisma.attendance.create({ data: { staffId: staffProfileRows[4].id, date: today, checkIn: lateIn, status: "LATE" } })
  }
  console.log("✔ Attendance seeded")

  await prisma.$disconnect()
  console.log("\n✅ Seed complete!")
  console.log("\n📋 Login credentials:")
  console.log("   Admin:       admin@gym.com     / GymAdmin@2025")
  console.log("   Agent:       agent@gym.com     / GymAgent@2025")
  console.log("   Coach:       coach@gym.com     / GymCoach@2025")
  console.log("   Nutritionist nutri@gym.com     / GymNutri@2025")
}

seed()
