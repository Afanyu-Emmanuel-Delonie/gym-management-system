"use client"

import { useState } from "react"
import { Users, CalendarDays, ClipboardCheck } from "lucide-react"
import StaffList from "./components/StaffList"
import RosterBuilder from "./components/RosterBuilder"
import Attendance from "./components/Attendance"

const TABS = [
  { key: "staff",      label: "Staff Members", icon: <Users size={15} /> },
  { key: "roster",     label: "Roster",        icon: <CalendarDays size={15} /> },
  { key: "attendance", label: "Attendance",    icon: <ClipboardCheck size={15} /> },
]

export default function StaffPage() {
  const [tab, setTab] = useState("staff")

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", gap: "0.25rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "0" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.6rem 1.1rem",
              fontSize: "var(--text-sm)", fontWeight: 500,
              border: "none", background: "none", cursor: "pointer",
              color: tab === t.key ? "var(--color-primary)" : "var(--color-text-secondary)",
              borderBottom: tab === t.key ? "2px solid var(--color-primary)" : "2px solid transparent",
              marginBottom: "-1px",
              transition: "all 0.15s",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "staff"      && <StaffList />}
      {tab === "roster"     && <RosterBuilder />}
      {tab === "attendance" && <Attendance />}
    </div>
  )
}
