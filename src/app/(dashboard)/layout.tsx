import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/Sidebar"
import Header from "@/components/dashboard/Header"
import { SidebarProvider } from "@/components/dashboard/SidebarContext"
import prisma from "@/lib/prisma"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const profile = await prisma.profile.findUnique({ where: { id: user.id } })

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar role={profile?.role ?? "CLIENT"} />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Header fullName={profile?.fullName ?? ""} role={profile?.role ?? ""} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6" style={{ backgroundColor: "var(--color-background)" }}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
