"use client"

import { useState } from "react"
import { Dumbbell, MessageSquare, Mail } from "lucide-react"
import Services from "./components/Services"
import Testimonials from "./components/Testimonials"
import Inquiries from "./components/Inquiries"

const TABS = [
  { key: "services",     label: "Services",     icon: <Dumbbell size={15} /> },
  { key: "testimonials", label: "Testimonials", icon: <MessageSquare size={15} /> },
  { key: "inquiries",    label: "Inquiries",    icon: <Mail size={15} /> },
]

export default function ContentPage() {
  const [tab, setTab] = useState("services")

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", gap: "0.25rem", borderBottom: "1px solid var(--color-border)" }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            padding: "0.6rem 1.1rem", fontSize: "var(--text-sm)", fontWeight: 500,
            border: "none", background: "none", cursor: "pointer",
            color: tab === t.key ? "var(--color-primary)" : "var(--color-text-secondary)",
            borderBottom: tab === t.key ? "2px solid var(--color-primary)" : "2px solid transparent",
            marginBottom: "-1px", transition: "all 0.15s",
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      {tab === "services"     && <Services />}
      {tab === "testimonials" && <Testimonials />}
      {tab === "inquiries"    && <Inquiries />}
    </div>
  )
}
