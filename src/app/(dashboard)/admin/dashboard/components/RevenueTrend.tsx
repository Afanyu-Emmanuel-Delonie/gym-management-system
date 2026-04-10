"use client"

import { useState } from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import type { CardKey } from "./StatCards"

const LABELS: Record<CardKey, string> = {
  revenue:       "Revenue (RWF)",
  members:       "Members",
  subscriptions: "Subscriptions",
  orders:        "Orders",
}

interface Props {
  trendData: Record<CardKey, { label: string; value: number }[]>
}

export default function RevenueTrend({ trendData }: Props) {
  const [activeCard, setActiveCard] = useState<CardKey>("revenue")

  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h3 style={{ margin: 0 }}>{LABELS[activeCard]} Trend</h3>
          <p style={{ margin: "2px 0 0", fontSize: "var(--text-sm)" }}>Last 12 months</p>
        </div>
        <select
          value={activeCard}
          onChange={(e) => setActiveCard(e.target.value as CardKey)}
          style={{ fontSize: "var(--text-sm)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "0.3rem 0.6rem", color: "var(--color-text-secondary)", background: "var(--color-surface)" }}
        >
          <option value="revenue">Revenue</option>
          <option value="members">Members</option>
          <option value="subscriptions">Subscriptions</option>
          <option value="orders">Orders</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={trendData[activeCard]} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} width={40} />
          <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid var(--color-border)" }} />
          <Line type="monotone" dataKey="value" stroke="#c60b0b" strokeWidth={2.5} dot={{ r: 3, fill: "#c60b0b" }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
