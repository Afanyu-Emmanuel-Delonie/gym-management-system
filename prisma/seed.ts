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

const users = [
  { email: "admin@gym.com",  password: "GymAdmin@2025",  fullName: "Admin User",  role: "ADMIN" },
  { email: "agent@gym.com",  password: "GymAgent@2025",  fullName: "Sales Agent", role: "SALES_AGENT" },
  { email: "coach@gym.com",  password: "GymCoach@2025",  fullName: "Coach User",  role: "COACH" },
]

async function seed() {
  console.log("🧹 Clearing database...")

  // Clear all profiles (cascades to related records)
  await prisma.profile.deleteMany()

  // Delete all Supabase auth users
  const { data: { users: authUsers } } = await supabase.auth.admin.listUsers()
  for (const u of authUsers) {
    await supabase.auth.admin.deleteUser(u.id)
  }

  console.log("✔ Database cleared\n")

  // Create new users
  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { full_name: user.fullName, role: user.role },
    })

    if (error) {
      console.error(`✘ ${user.email}: ${error.message}`)
      continue
    }

    await prisma.profile.create({
      data: {
        id: data.user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role as any,
      },
    })

    console.log(`✔ Created ${user.role}: ${user.email}`)
  }

  await prisma.$disconnect()
  console.log("\n✅ Seed complete")
}

seed()
