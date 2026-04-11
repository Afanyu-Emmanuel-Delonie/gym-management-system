"use server"

import { redirect } from "next/navigation"
import { createClient } from "../lib/supabase/server"
import prisma from "../lib/prisma"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function sanitize(val: unknown, maxLen = 100): string {
  return String(val ?? "").replace(/[\r\n<>]/g, "").trim().slice(0, maxLen)
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email       = sanitize(formData.get("email"), 254).toLowerCase()
  const password    = String(formData.get("password") ?? "")
  const fullName    = sanitize(formData.get("fullName"), 100)
  const phoneNumber = formData.get("phoneNumber") ? sanitize(formData.get("phoneNumber"), 20) : null

  if (!EMAIL_RE.test(email))  return { error: "Invalid email address." }
  if (password.length < 8)    return { error: "Password must be at least 8 characters." }
  if (fullName.length < 2)    return { error: "Full name is required." }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone_number: phoneNumber, role: "CLIENT" },
    },
  })

  // Never expose raw Supabase error messages to the client
  if (error) return { error: "Registration failed. Please try again." }

  if (data.user) {
    await prisma.profile.deleteMany({ where: { email, NOT: { id: data.user.id } } })
    await prisma.profile.upsert({
      where: { email },
      update: { id: data.user.id, fullName, phoneNumber },
      create: { id: data.user.id, email, fullName, phoneNumber, role: "CLIENT" },
    })
  }

  return redirect("/login")
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email    = sanitize(formData.get("email"), 254).toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (!EMAIL_RE.test(email) || !password) {
    return { error: "Invalid email or password. Please try again." }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  // Generic error — never reveal whether email exists or not (prevents user enumeration)
  if (error) return { error: "Invalid email or password. Please try again." }

  // Role from DB — never trust JWT user_metadata for authorization decisions
  const profile = await prisma.profile.findUnique({ where: { id: data.user.id } })

  switch (profile?.role) {
    case "ADMIN":       return redirect("/admin/dashboard")
    case "SALES_AGENT": return redirect("/agent/dashboard")
    case "COACH":       return redirect("/coach/dashboard")
    default:            return redirect("/login")
  }
}
