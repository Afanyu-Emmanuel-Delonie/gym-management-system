"use client"

import { CreditCard, Clock, CheckCircle, XCircle, Ban, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useState } from "react"

type CardKey = "total" | "active" | "pending" | "expired" | "cancelled"

const ICONS: Record<CardKey, React.ReactNode> = {
  total:     <CreditCard size={18} />,
  active:    <CheckCircle size={18} />,
  pending:   <Clock size={18} />,
  expired:   <XCircle size={18} />,
  cancelled: <Ban size={18} />,
}

interface Props {
  stats: { pending: number; active: number; expired: number; cancelled: number }
}

export default function SubscriptionStats({ stats }: Props) {
  const [active, setActive] = useState<CardKey>("active")
  const total = stats.pending + stats.active + stats.expired + stats.cancelled

  const cards: { key: CardKey; label: string; value: number; trend: string; trendUp: boolean }[] = [
    { key: "total",     label: "Total",     value: total,           trend: "+5%", trendUp: true  },
    { key: "active",    label: "Active",    value: stats.active,    trend: "+8%", trendUp: true  },
    { key: "pending",   label: "Pending",   value: stats.pending,   trend: "+2",  trendUp: false },
    { key: "expired",   label: "Expired",   value: stats.expired,   trend: "-3%", trendUp: false },
    { key: "cancelled", label: "Cancelled", value: stats.cancelled, trend: "-1",  trendUp: true  },
  ]

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "1rem" }}>
      {cards.map((card) => {
        const isActive = active === card.key
        return (
          <button
            key={card.key}
            onClick={() => setActive(card.key)}
            style={{
              textAlign: "left", cursor: "pointer", borderRadius: "var(--radius-lg)", padding: "1rem",
              background: isActive ? "linear-gradient(135deg,#c60b0b 0%,#8b0000 60%,#1a0000 100%)" : "var(--color-surface)",
              boxShadow: isActive ? "0 8px 24px #c60b0b40" : "var(--shadow-sm)",
              border: isActive ? "none" : "1px solid var(--color-border)",
              transition: "all 0.25s", display: "flex", flexDirection: "column", gap: "0.5rem",
              position: "relative", overflow: "hidden",
            } as React.CSSProperties}
          >
            {isActive && <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg,#ffffff08 0px,#ffffff08 1px,transparent 1px,transparent 8px)", pointerEvents: "none" }} />}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
              <span style={{ fontSize: "var(--text-xs)", color: isActive ? "#ffffff99" : "var(--color-text-secondary)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{card.label}</span>
              <span style={{ color: isActive ? "#fff" : "var(--color-primary)", backgroundColor: isActive ? "#ffffff18" : "var(--color-primary-subtle)", padding: "0.3rem", borderRadius: "var(--radius-md)", display: "flex" }}>{ICONS[card.key]}</span>
            </div>
            <p style={{ margin: 0, fontSize: "var(--text-3xl)", fontWeight: 400, color: isActive ? "#fff" : "var(--color-text-primary)", lineHeight: 1, position: "relative", fontFamily: "var(--font-title)" }}>{card.value}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "var(--text-xs)", color: isActive ? "#ffffff99" : card.trendUp ? "var(--color-success)" : "var(--color-danger)", fontWeight: 500, position: "relative" }}>
              {card.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {card.trend} vs last month
            </div>
          </button>
        )
      })}
    </div>
  )
}
