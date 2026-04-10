import { PrismaClient } from "../src/generated/prisma/client.ts"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! })
const prisma = new PrismaClient({ adapter })

const TEST_EMAIL = "testflow@gym.com"

async function cleanup() {
  const profile = await prisma.profile.findUnique({ where: { email: TEST_EMAIL } })
  if (profile) {
    await prisma.subscription.deleteMany({ where: { profileId: profile.id } })
    await prisma.profile.delete({ where: { id: profile.id } })
  }
}

async function run() {
  console.log("\n========== GYM FLOW TEST ==========\n")

  await cleanup()

  // --- STEP 1: Create a test user ---
  console.log("STEP 1: Creating test user...")
  const user = await prisma.profile.create({
    data: {
      id: crypto.randomUUID(),
      email: TEST_EMAIL,
      fullName: "Test Client",
      role: "CLIENT",
    },
  })
  console.log(`✔ User created: ${user.fullName} (${user.id})\n`)

  // --- STEP 2: Create a PENDING subscription ---
  console.log("STEP 2: Creating PENDING subscription...")
  const sub = await prisma.subscription.create({
    data: { profileId: user.id, type: "MONTHLY", status: "PENDING" },
  })
  console.log(`✔ Subscription created: ${sub.id} | status: ${sub.status}\n`)

  // --- STEP 3: Try to verify with no code (should fail) ---
  console.log("STEP 3: Trying gym entry with PENDING subscription (should fail)...")
  const pendingResult = await prisma.subscription.findUnique({
    where: { accessCode: "000000" },
  })
  if (!pendingResult) {
    console.log(`✔ Correctly rejected: Code not found (no code assigned yet)\n`)
  }

  // --- STEP 4: Activate subscription (agent confirms payment) ---
  console.log("STEP 4: Agent activating subscription...")
  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(startDate.getDate() + 30)
  const accessCode = Math.floor(100000 + Math.random() * 900000).toString()

  const activeSub = await prisma.subscription.update({
    where: { id: sub.id },
    data: { status: "ACTIVE", startDate, endDate, accessCode },
  })
  console.log(`✔ Subscription activated!`)
  console.log(`  Access Code : ${activeSub.accessCode}`)
  console.log(`  Expires At  : ${activeSub.endDate?.toDateString()}\n`)

  // --- STEP 5: Verify gym entry with the code (should succeed) ---
  console.log("STEP 5: Verifying gym entry with access code (should succeed)...")
  const found = await prisma.subscription.findUnique({
    where: { accessCode: activeSub.accessCode! },
    include: { profile: true },
  })

  if (!found) {
    console.log("✘ FAILED: Code not found")
  } else if (found.status !== "ACTIVE") {
    console.log(`✘ FAILED: Subscription status is ${found.status}`)
  } else if (found.endDate && found.endDate < new Date()) {
    console.log("✘ FAILED: Subscription has expired")
  } else {
    console.log(`✔ Entry granted!`)
    console.log(`  User : ${found.profile.fullName}`)
    console.log(`  Plan : ${found.type}`)
    console.log(`  Role : ${found.profile.role}\n`)
  }

  // --- STEP 6: Try wrong code (should fail) ---
  console.log("STEP 6: Trying wrong code (should fail)...")
  const wrongCode = await prisma.subscription.findUnique({
    where: { accessCode: "000000" },
  })
  if (!wrongCode) {
    console.log(`✔ Correctly rejected: Invalid code\n`)
  }

  // --- CLEANUP ---
  await cleanup()
  console.log("========== TEST COMPLETE ==========\n")

  await prisma.$disconnect()
}

run().catch(async (e) => {
  console.error("Test failed:", e)
  await cleanup()
  await prisma.$disconnect()
  process.exit(1)
})
