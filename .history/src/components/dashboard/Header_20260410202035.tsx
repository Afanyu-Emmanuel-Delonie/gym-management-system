"use client"

import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { useSidebar } from "./SidebarContext"

const pageTitles: Record<string, string> = {
  "/admin/dashboard":     "Dashboard",
  "/admin/staff":         "Staff Management",
  "/admin/subscriptions": "Subscriptions",
  "/admin/store":         "Store",
  "/admin/content":       "Content",
  "/agent/dashboard":     "Dashboard",
  "/agent/subscriptions": "Subscriptions",
  "/agent/access":        "Access Verification",
  "/coach/dashboard":     "Dashboard",
  "/coach/schedule":      "Schedule",
}

export default function Header({ fullName, role }: { fullName: string; role: string }) {
  const pathname = usePathname()
  const { toggle } = useSidebar()
  const title = pageTitles[pathname] ?? "Dashboard"

  return (
    <header
      style={{
        backgroundColor: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        padding: "0 1.5rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={toggle}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text-secondary)",
            display: "flex",
            alignItems: "center",
            padding: "0.25rem",
            borderRadius: "var(--radius-sm)",
          }}
          className="hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h2 style={{ margin: 0, fontSize: "var(--text-xl)", color: "var(--color-text-primary)" }}>
          {title}
        </h2>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-primary)" }}>
            {fullName}
          </p>
          <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
            {role.replace("_", " ")}
          </p>
        </div>
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            backgroundColor: "var(--color-primary)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "var(--text-sm)",
            flexShrink: 0,
          }}
        >
          {fullName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}
