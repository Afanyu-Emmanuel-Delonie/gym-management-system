"use client"

import { useState } from "react"
import { Users, CreditCard, TrendingUp, ShoppingBag, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { formatMoney } from "@/lib/utils"

export type CardKey = "revenue" | "members" | "subscriptions" | "orders"

interface Stats {
  activeMembers: number
  activeSubscriptions: number
  pendingOrders: number
  totalRevenue: number
  newMembersThisMonth: number
  newSubsThisMonth: number
}

interface Props {
  stats: Stats
  trendData: Record<CardKey, { label: string; value: number }[]>
  onSelect?: (k: CardKey) => void
  active?: CardKey
}

const ICONS: Record<CardKey, React.ReactNode> = {
  members:       <Users size={18} />,
  subscriptions: <CreditCard size={18} />,
  revenue:       <TrendingUp size={18} />,
  orders:        <ShoppingBag size={18} />,
}

export default function StatCards({ stats, trendData, onSelect, active: externalActive }: Props) {
  const [internalActive, setInternalActive] = useState<CardKey>("revenue")
  const active = externalActive ?? internalActive

  const cards = [
    { key: "members"       as CardKey, label: "Active Members",       value: stats.activeMembers,       sub: `+${stats.newMembersThisMonth} this month`, trendUp: stats.newMembersThisMonth >= 0 },
    { key: "subscriptions" as CardKey, label: "Active Subscriptions", value: stats.activeSubscriptions, sub: `+${stats.newSubsThisMonth} this month`,    trendUp: stats.newSubsThisMonth >= 0 },
    { key: "revenue"       as CardKey, label: "Total Revenue",        value: formatMoney(stats.totalRevenue), sub: "all time",              trendUp: true },
    { key: "orders"        as CardKey, label: "Pending Orders",       value: stats.pendingOrders,       sub: "awaiting processing",                       trendUp: stats.pendingOrders === 0 },
  ]

  const handleSelect = (k: CardKey) => {
    setInternalActive(k)
    onSelect?.(k)
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
      {cards.map((card) => {
        const isActive = active === card.key
        return (
          <button
            key={card.key}
            onClick={() => handleSelect(card.key)}
            style={{
              textAlign: "left", cursor: "pointer", borderRadius: "var(--radius-lg)", padding: "1.5rem",
              background: isActive ? "linear-gradient(135deg,#c60b0b 0%,#8b0000 60%,#1a0000 100%)" : "var(--color-surface)",
              boxShadow: isActive ? "0 8px 24px #c60b0b40" : "var(--shadow-sm)",
              border: isActive ? "none" : "1px solid var(--color-border)",
              transition: "all 0.25s", display: "flex", flexDirection: "column", gap: "0.75rem",
              position: "relative", overflow: "hidden",
            } as React.CSSProperties}
          >
            {isActive && <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg,#ffffff08 0px,#ffffff08 1px,transparent 1px,transparent 8px)", pointerEvents: "none" }} />}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
              <span style={{ fontSize: "var(--text-xs)", color: isActive ? "#ffffff99" : "var(--color-text-secondary)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{card.label}</span>
              <span style={{ color: isActive ? "#fff" : "var(--color-primary)", backgroundColor: isActive ? "#ffffff18" : "var(--color-primary-subtle)", padding: "0.4rem", borderRadius: "var(--radius-md)", display: "flex" }}>{ICONS[card.key]}</span>
            </div>
            <p style={{ margin: 0, fontSize: "var(--text-3xl)", fontWeight: 400, color: isActive ? "#fff" : "var(--color-text-primary)", lineHeight: 1, position: "relative", fontFamily: "var(--font-title)" }}>{card.value}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "var(--text-xs)", color: isActive ? "#ffffff99" : card.trendUp ? "var(--color-success)" : "var(--color-danger)", fontWeight: 500, position: "relative" }}>
              {card.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {card.sub}
            </div>
          </button>
        )
      })}
    </div>
  )
}
