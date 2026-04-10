"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, CreditCard, ShoppingBag, Dumbbell, MessageSquare, QrCode, LogOut } from "lucide-react"
import { useSidebar } from "./SidebarContext"

type Role = "ADMIN" | "SALES_AGENT" | "COACH" | "NUTRITIONIST" | "CLIENT"

const navItems: Record<string, { label: string; href: string; icon: React.ReactNode }[]> = {
  ADMIN: [
    { label: "Dashboard",     href: "/admin/dashboard",     icon: <LayoutDashboard size={18} /> },
    { label: "Staff",         href: "/admin/staff",         icon: <Users size={18} /> },
    { label: "Subscriptions", href: "/admin/subscriptions", icon: <CreditCard size={18} /> },
    { label: "Store",         href: "/admin/store",         icon: <ShoppingBag size={18} /> },
    { label: "Content",       href: "/admin/content",       icon: <MessageSquare size={18} /> },
  ],
  SALES_AGENT: [
    { label: "Dashboard",     href: "/agent/dashboard",     icon: <LayoutDashboard size={18} /> },
    { label: "Subscriptions", href: "/agent/subscriptions", icon: <CreditCard size={18} /> },
    { label: "Access",        href: "/agent/access",        icon: <QrCode size={18} /> },
  ],
}

export default function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname()
  const { collapsed } = useSidebar()
  const links = navItems[role] ?? []

  return (
    <aside
      style={{
        backgroundColor: "var(--color-sidebar-bg)",
        width: collapsed ? "64px" : "240px",
        minWidth: collapsed ? "64px" : "240px",
        transition: "width 0.2s ease, min-width 0.2s ease",
      }}
      className="flex flex-col h-full"
    >
      {/* Logo */}
      <div
        className="flex items-center px-4 py-5"
        style={{ borderBottom: "1px solid #ffffff1a", gap: "0.75rem", overflow: "hidden", height: "64px" }}
      >
        <Dumbbell size={22} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
        {!collapsed && (
          <span style={{ color: "var(--color-primary)", fontFamily: "var(--font-title)", fontSize: "var(--text-lg)", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
            GYP
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {links.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              style={{
                backgroundColor: isActive ? "var(--color-sidebar-active)" : "transparent",
                color: isActive ? "#fff" : "var(--color-sidebar-text)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: collapsed ? "0.6rem" : "0.5rem 0.75rem",
                justifyContent: collapsed ? "center" : "flex-start",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
              className="font-medium transition-colors hover:bg-white/10"
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-2 py-4" style={{ borderTop: "1px solid #ffffff1a" }}>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            title={collapsed ? "Sign out" : undefined}
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--text-sm)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: collapsed ? "0.6rem" : "0.5rem 0.75rem",
              justifyContent: collapsed ? "center" : "flex-start",
              width: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
              borderRadius: "var(--radius-md)",
            }}
            className="hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Sign out</span>}
          </button>
        </form>
      </div>
    </aside>
  )
}
