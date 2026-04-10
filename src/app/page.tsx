import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const profile = await prisma.profile.findUnique({ where: { id: user.id } })

  switch (profile?.role) {
    case "ADMIN":       redirect("/admin/dashboard")
    case "SALES_AGENT": redirect("/agent/dashboard")
    case "COACH":       redirect("/coach/dashboard")
    default:            redirect("/login")
  }
}
