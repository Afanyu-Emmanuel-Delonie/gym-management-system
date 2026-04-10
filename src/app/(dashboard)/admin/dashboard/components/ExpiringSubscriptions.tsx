import { AlertTriangle } from "lucide-react"

type Sub = {
  id: string
  type: string
  endDate: Date | null
  profile: { fullName: string }
}

export default function ExpiringSubscriptions({ subscriptions }: { subscriptions: Sub[] }) {
  const daysLeft = (end: Date | null) => {
    if (!end) return null
    return Math.ceil((new Date(end).getTime() - Date.now()) / 86400000)
  }

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <AlertTriangle size={16} style={{ color: "#f59e0b" }} />
          <h3 style={{ margin: 0 }}>Expiring Soon</h3>
        </div>
        <a href="/admin/subscriptions" style={{ fontSize: "var(--text-xs)", color: "var(--color-primary)", textDecoration: "none", fontWeight: 500 }}>View all</a>
      </div>
      {subscriptions.length === 0 ? (
        <p style={{ padding: "1.5rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "var(--text-sm)", margin: 0 }}>No subscriptions expiring soon</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface-raised)" }}>
              {["Member", "Plan", "Expires"].map((h) => (
                <th key={h} style={{ padding: "0.6rem 1.25rem", textAlign: "left", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => {
              const d = daysLeft(s.endDate)
              return (
                <tr key={s.id} style={{ borderTop: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "0.75rem 1.25rem", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-primary)" }}>{s.profile.fullName}</td>
                  <td style={{ padding: "0.75rem 1.25rem", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{s.type}</td>
                  <td style={{ padding: "0.75rem 1.25rem" }}>
                    <span style={{
                      fontSize: "var(--text-xs)", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: "999px",
                      backgroundColor: d !== null && d <= 3 ? "var(--color-danger-subtle)" : "var(--color-warning-subtle)",
                      color: d !== null && d <= 3 ? "var(--color-danger)" : "var(--color-warning)",
                    }}>
                      {d !== null ? `${d}d left` : "—"}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
