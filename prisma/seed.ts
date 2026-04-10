import { createClient } from "@supabase/supabase-js"
import { PrismaClient } from "../app/generated/prisma/client.ts"
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
  { email: "admin@gym.com",        password: "Admin1234!",  fullName: "Admin User",        role: "ADMIN" },
  { email: "agent@gym.com",        password: "Agent1234!",  fullName: "Sales Agent",       role: "SALES_AGENT" },
  { email: "coach@gym.com",        password: "Coach1234!",  fullName: "Coach User",        role: "COACH" },
  { email: "nutritionist@gym.com", password: "Nutri1234!",  fullName: "Nutritionist User", role: "NUTRITIONIST" },
  { email: "client@gym.com",       password: "Client1234!", fullName: "Client User",       role: "CLIENT" },
]

async function seed() {
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

    await prisma.profile.upsert({
      where: { id: data.user.id },
      update: {},
      create: {
        id: data.user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role as any,
      },
    })

    console.log(`✔ Created ${user.role}: ${user.email}`)
  }

  await prisma.$disconnect()
}

seed()
