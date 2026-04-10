"use client"

import { useState } from "react"
import {
  Users, CreditCard, TrendingUp, ShoppingBag,
  ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight,
} from "lucide-react"
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts"

// ─── Types ───────────────────────────────────────────────────
type CardKey = "members" | "subscriptions" | "revenue" | "orders"

const CARDS: { key: CardKey; label: string; value: string; sub: string; trend: string; trendUp: boolean; icon: React.ReactNode }[] = [
  { key: "members",       label: "Active Members",       value: "248",  sub: "registered clients",   trend: "+12%", trendUp: true,  icon: <Users size={18} /> },
  { key: "subscriptions", label: "Active Subscriptions", value: "184",  sub: "currently valid",       trend: "+8%",  trendUp: true,  icon: <CreditCard size={18} /> },
  { key: "revenue",       label: "Monthly Revenue",      value: "2.4M", sub: "RWF this month",        trend: "+15%", trendUp: true,  icon: <TrendingUp size={18} /> },
  { key: "orders",        label: "Pending Orders",       value: "12",   sub: "awaiting processing",   trend: "+3",   trendUp: false, icon: <ShoppingBag size={18} /> },
]

// ─── Chart data per card ──────────────────────────────────────
const LINE_DATA: Record<CardKey, { label: string; value: number }[]> = {
  members: [
    { label: "Jan", value: 180 }, { label: "Feb", value: 195 }, { label: "Mar", value: 200 },
    { label: "Apr", value: 210 }, { label: "May", value: 220 }, { label: "Jun", value: 215 },
    { label: "Jul", value: 225 }, { label: "Aug", value: 230 }, { label: "Sep", value: 235 },
    { label: "Oct", value: 240 }, { label: "Nov", value: 245 }, { label: "Dec", value: 248 },
  ],
  subscriptions: [
    { label: "Jan", value: 120 }, { label: "Feb", value: 130 }, { label: "Mar", value: 125 },
    { label: "Apr", value: 140 }, { label: "May", value: 150 }, { label: "Jun", value: 145 },
    { label: "Jul", value: 155 }, { label: "Aug", value: 160 }, { label: "Sep", value: 165 },
    { label: "Oct", value: 170 }, { label: "Nov", value: 178 }, { label: "Dec", value: 184 },
  ],
  revenue: [
    { label: "Jan", value: 1200000 }, { label: "Feb", value: 1400000 }, { label: "Mar", value: 1350000 },
    { label: "Apr", value: 1600000 }, { label: "May", value: 1750000 }, { label: "Jun", value: 1700000 },
    { label: "Jul", value: 1900000 }, { label: "Aug", value: 2000000 }, { label: "Sep", value: 2100000 },
    { label: "Oct", value: 2200000 }, { label: "Nov", value: 2300000 }, { label: "Dec", value: 2400000 },
  ],
  orders: [
    { label: "Jan", value: 5 }, { label: "Feb", value: 8 }, { label: "Mar", value: 6 },
    { label: "Apr", value: 10 }, { label: "May", value: 9 }, { label: "Jun", value: 7 },
    { label: "Jul", value: 11 }, { label: "Aug", value: 13 }, { label: "Sep", value: 10 },
    { label: "Oct", value: 14 }, { label: "Nov", value: 12 }, { label: "Dec", value: 12 },
  ],
}

const DONUT_DATA = [
  { name: "Monthly",  value: 98,  color: "#c60b0b" },
  { name: "Yearly",   value: 52,  color: "#6366f1" },
  { name: "Weekly",   value: 24,  color: "#f59e0b" },
  { name: "Daily",    value: 10,  color: "#22c55e" },
]

// ─── Recent Subscriptions ─────────────────────────────────────
const RECENT_SUBS = [
  { name: "Alice Martin",      type: "MONTHLY", status: "PENDING",  date: "Today, 9:12am" },
  { name: "Bob Kariuki",       type: "WEEKLY",  status: "ACTIVE",   date: "Today, 8:45am" },
  { name: "Claire Uwase",      type: "YEARLY",  status: "PENDING",  date: "Yesterday" },
  { name: "David Nkurunziza",  type: "DAILY",   status: "ACTIVE",   date: "Yesterday" },
  { name: "Eva Mutoni",        type: "MONTHLY", status: "EXPIRED",  date: "2 days ago" },
]

const STATUS_BADGE: Record<string, string> = {
  PENDING:   "badge badge-warning",
  ACTIVE:    "badge badge-success",
  EXPIRED:   "badge badge-muted",
  CANCELLED: "badge badge-danger",
}

// ─── Mini Calendar ────────────────────────────────────────────
function MiniCalendar({ onDateSelect }: { onDateSelect: (d: Date) => void }) {
  const today = new Date()
  const [cur, setCur] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [sel, setSel] = useState<Date>(today)

  const y = cur.getFullYear(), m = cur.getMonth()
  const blanks = Array.from({ length: new Date(y, m, 1).getDay() })
  const days   = Array.from({ length: new Date(y, m + 1, 0).getDate() }, (_, i) => i + 1)

  const pick = (d: number) => { const dt = new Date(y, m, d); setSel(dt); onDateSelect(dt) }
  const isToday    = (d: number) => today.getFullYear() === y && today.getMonth() === m && today.getDate() === d
  const isSelected = (d: number) => sel.getFullYear() === y && sel.getMonth() === m && sel.getDate() === d

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <button onClick={() => setCur(new Date(y, m - 1, 1))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", display: "flex" }}><ChevronLeft size={15} /></button>
        <span style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>{cur.toLocaleString("default", { month: "long" })} {y}</span>
        <button onClick={() => setCur(new Date(y, m + 1, 1))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", display: "flex" }}><ChevronRight size={15} /></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px", marginBottom: "4px" }}>
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: "10px", fontWeight: 600, color: "var(--color-text-muted)" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px" }}>
        {blanks.map((_, i) => <div key={`b${i}`} />)}
        {days.map((d) => (
          <button key={d} onClick={() => pick(d)} style={{
            aspectRatio: "1", border: "none", cursor: "pointer",
            borderRadius: "var(--radius-sm)", fontSize: "11px",
            fontWeight: isSelected(d) ? 700 : 400,
            backgroundColor: isSelected(d) ? "var(--color-primary)" : isToday(d) ? "var(--color-primary-subtle)" : "transparent",
            color: isSelected(d) ? "#fff" : isToday(d) ? "var(--color-primary)" : "var(--color-text-primary)",
            transition: "all 0.1s",
          }}>
            {d}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeCard, setActiveCard] = useState<CardKey>("revenue")
  const [selectedDate, setSelectedDate] = useState(new Date())

  const activeData = LINE_DATA[activeCard]
  const activeCardInfo = CARDS.find((c) => c.key === activeCard)!

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* ── FULL WIDTH: 4 Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {CARDS.map((card) => {
          const active = activeCard === card.key
          return (
            <button
              key={card.key}
              onClick={() => setActiveCard(card.key)}
              style={{
                textAlign: "left",
                cursor: "pointer",
                border: "none",
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem",
                background: active
                  ? "linear-gradient(135deg, #c60b0b 0%, #8b0000 60%, #1a0000 100%)"
                  : "var(--color-surface)",
                boxShadow: active ? "0 8px 24px #c60b0b40" : "var(--shadow-sm)",
                border: active ? "none" : "1px solid var(--color-border)",
                transition: "all 0.25s",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                position: "relative",
                overflow: "hidden",
              } as React.CSSProperties}
            >
              {/* gym texture overlay on active */}
              {active && (
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: "repeating-linear-gradient(45deg, #ffffff08 0px, #ffffff08 1px, transparent 1px, transparent 8px)",
                  pointerEvents: "none",
                }} />
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
                <span style={{ fontSize: "var(--text-xs)", color: active ? "#ffffff99" : "var(--color-text-secondary)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{card.label}</span>
                <span style={{
                  color: active ? "#fff" : "var(--color-primary)",
                  backgroundColor: active ? "#ffffff18" : "var(--color-primary-subtle)",
                  padding: "0.4rem", borderRadius: "var(--radius-md)", display: "flex",
                }}>{card.icon}</span>
              </div>
              <p style={{ margin: 0, fontSize: "var(--text-3xl)", fontWeight: 500, color: active ? "#fff" : "var(--color-text-primary)", lineHeight: 1, position: "relative", fontFamily: "var(--font-title)" }}>
                {card.value}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "var(--text-xs)", color: active ? "#ffffff99" : card.trendUp ? "var(--color-success)" : "var(--color-danger)", fontWeight: 500, position: "relative" }}>
                {card.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {card.trend} vs last month
              </div>
            </button>
          )
        })}
      </div>

      {/* ── BELOW: 70 / 30 split ── */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* LEFT 70% */}
        <div style={{ flex: "1 1 65%", minWidth: "300px", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Timeline chart */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div>
                <h3 style={{ margin: 0 }}>{activeCardInfo.label} Trend</h3>
                <p style={{ margin: "2px 0 0", fontSize: "var(--text-sm)" }}>Monthly overview for 2025</p>
              </div>
              <select style={{ fontSize: "var(--text-sm)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "0.3rem 0.6rem", color: "var(--color-text-secondary)", background: "var(--color-surface)" }}>
                <option>2025</option><option>2024</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={activeData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid var(--color-border)" }} />
                <Line type="monotone" dataKey="value" stroke="#c60b0b" strokeWidth={2.5} dot={{ r: 3, fill: "#c60b0b" }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Donut chart */}
          <div className="card">
            <h3 style={{ margin: "0 0 1rem" }}>Income Distribution</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={DONUT_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {DONUT_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {DONUT_DATA.map((d) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: d.color, flexShrink: 0 }} />
                      <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)" }}>
                      {d.value} <span style={{ fontWeight: 400, color: "var(--color-text-muted)", fontSize: "var(--text-xs)" }}>({Math.round(d.value / DONUT_DATA.reduce((a, b) => a + b.value, 0) * 100)}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 30% */}
        <div style={{ flex: "1 1 28%", minWidth: "260px", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Calendar */}
          <div className="card">
            <h3 style={{ margin: "0 0 1rem" }}>Filter by Date</h3>
            <MiniCalendar onDateSelect={setSelectedDate} />
            <p style={{ margin: "0.75rem 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textAlign: "center" }}>
              {selectedDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>

          {/* Recent subscriptions */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Recent Subscriptions</h3>
              <a href="/admin/subscriptions" style={{ fontSize: "var(--text-xs)", color: "var(--color-primary)", textDecoration: "none", fontWeight: 500 }}>View all</a>
            </div>
            {RECENT_SUBS.map((s, i) => (
              <div key={i} style={{ padding: "0.85rem 1.25rem", borderBottom: i < RECENT_SUBS.length - 1 ? "1px solid var(--color-border)" : "none", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-primary)" }}>{s.name}</span>
                  <span className={STATUS_BADGE[s.status]}>{s.status}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{s.type}</span>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{s.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
