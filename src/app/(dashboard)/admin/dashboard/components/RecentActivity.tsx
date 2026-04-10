"use client"

import { Clock, CreditCard, ShoppingBag } from "lucide-react"

type Activity = {
  text: string
  detail: string
  type: string
  time: string
}

const TYPE_STYLES: Record<string, { bg: string; color: string }> = {
  Subscription: { bg: "var(--color-success-subtle)", color: "var(--color-success)" },
  Order:        { bg: "var(--color-primary-subtle)", color: "var(--color-primary)" },
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Subscription: <CreditCard size={14} />,
  Order:        <ShoppingBag size={14} />,
}

const TYPE_COLORS: Record<string, string> = {
  Subscription: "#22c55e",
  Order:        "#c60b0b",
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return "just now"
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs} hr${hrs > 1 ? "s" : ""} ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function RecentActivity({ activities }: { activities: Activity[] }) {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Clock size={16} style={{ color: "var(--color-primary)" }} />
        <h3 style={{ margin: 0 }}>Recent Activity</h3>
      </div>
      {activities.length === 0 ? (
        <p style={{ padding: "1.5rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "var(--text-sm)", margin: 0 }}>No recent activity</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface-raised)" }}>
              {["Activity", "Detail", "Type", "Time"].map((h) => (
                <th key={h} style={{ padding: "0.65rem 1.5rem", textAlign: "left", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activities.map((a, i) => {
              const color = TYPE_COLORS[a.type] ?? "#6366f1"
              const style = TYPE_STYLES[a.type] ?? { bg: "#ede9fe", color: "#6366f1" }
              return (
                <tr key={i} style={{ borderTop: "1px solid var(--color-border)", transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-raised)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "0.85rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                      <span style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: `${color}18`, color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {TYPE_ICONS[a.type] ?? <CreditCard size={14} />}
                      </span>
                      <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-primary)" }}>{a.text}</span>
                    </div>
                  </td>
                  <td style={{ padding: "0.85rem 1.5rem", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{a.detail}</td>
                  <td style={{ padding: "0.85rem 1.5rem" }}>
                    <span style={{ fontSize: "var(--text-xs)", fontWeight: 500, padding: "0.2rem 0.6rem", borderRadius: "999px", backgroundColor: style.bg, color: style.color }}>
                      {a.type}
                    </span>
                  </td>
                  <td style={{ padding: "0.85rem 1.5rem", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>{timeAgo(a.time)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
