"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type Role = "ADMIN" | "SALES_AGENT" | "COACH" | "NUTRITIONIST" | "CLIENT"

const navItems: Record<Role, { label: string; href: string }[]> = {
  ADMIN: [
    { label: "Dashboard",     href: "/admin/dashboard" },
    { label: "Staff",         href: "/admin/staff" },
    { label: "Subscriptions", href: "/admin/subscriptions" },
    { label: "Store",         href: "/admin/store" },
    { label: "Services",      href: "/admin/services" },
    { label: "Testimonials",  href: "/admin/testimonials" },
  ],
  SALES_AGENT: [
    { label: "Dashboard",     href: "/agent/dashboard" },
    { label: "Subscriptions", href: "/agent/subscriptions" },
    { label: "Access",        href: "/agent/access" },
  ],
  COACH: [
    { label: "Dashboard",     href: "/coach/dashboard" },
    { label: "Schedule",      href: "/coach/schedule" },
  ],
  NUTRITIONIST: [
    { label: "Dashboard",     href: "/coach/dashboard" },
    { label: "Schedule",      href: "/coach/schedule" },
  ],
  CLIENT: [],
}

export default function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname()
  const links = navItems[role] ?? []

  return (
    <aside
      style={{ backgroundColor: "var(--color-sidebar-bg)", width: "240px", minWidth: "240px" }}
      className="flex flex-col h-full"
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-white font-bold text-lg tracking-tight">GymPro</span>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-xs)" }} className="mt-0.5">
          {role.replace("_", " ")}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                backgroundColor: isActive ? "var(--color-sidebar-active)" : "transparent",
                color: isActive ? "#fff" : "var(--color-sidebar-text)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
              }}
              className="flex items-center px-3 py-2 font-medium transition-colors hover:bg-white/10"
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-white/10">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}
            className="w-full text-left px-3 py-2 rounded hover:bg-white/10 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
