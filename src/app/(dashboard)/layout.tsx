import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/Sidebar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={user.user_metadata?.role} />
      <main className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6">
        {children}
      </main>
    </div>
  )
}
