"use client"

import { useState } from "react"
import { Bell, Check, Trash2 } from "lucide-react"
import { MOCK_NOTIFICATIONS, NOTIF_TYPE_COLORS, Notification } from "@/constants/dashboard"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const markAllRead = () => setNotifications((p) => p.map((n) => ({ ...n, read: true })))
  const markRead = (id: string) => setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n))
  const remove = (id: string) => setNotifications((p) => p.filter((n) => n.id !== id))

  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications
  const unread = notifications.filter((n) => !n.read).length

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Bell size={22} style={{ color: "var(--color-primary)" }} />
          <div>
            <h1 style={{ margin: 0, fontSize: "var(--text-2xl)" }}>Notifications</h1>
            <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
              {unread} unread
            </p>
          </div>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn btn-outline btn-sm" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Check size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "0.35rem 1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              cursor: "pointer",
              backgroundColor: filter === f ? "var(--color-primary)" : "var(--color-surface)",
              color: filter === f ? "#fff" : "var(--color-text-secondary)",
              transition: "all 0.15s",
            }}
          >
            {f === "all" ? "All" : `Unread (${unread})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            <Bell size={32} style={{ marginBottom: "0.75rem", opacity: 0.3 }} />
            <p style={{ margin: 0 }}>No notifications</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              style={{
                display: "flex",
                gap: "1rem",
                padding: "1rem 1.25rem",
                borderBottom: "1px solid var(--color-border)",
                opacity: n.read ? 0.6 : 1,
                backgroundColor: n.read ? "transparent" : "var(--color-primary-subtle)",
                transition: "background 0.15s",
              }}
            >
              {/* dot */}
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0, marginTop: "5px", backgroundColor: n.read ? "transparent" : NOTIF_TYPE_COLORS[n.type] }} />

              {/* content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: n.read ? 400 : 600, fontSize: "var(--text-sm)", color: "var(--color-text-primary)" }}>
                  {n.title}
                </p>
                <p style={{ margin: "3px 0 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                  {n.message}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                  {n.time}
                </p>
              </div>

              {/* actions */}
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", flexShrink: 0 }}>
                {!n.read && (
                  <button onClick={() => markRead(n.id)} title="Mark as read" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)", padding: "0.2rem" }}>
                    <Check size={15} />
                  </button>
                )}
                <button onClick={() => remove(n.id)} title="Remove" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", padding: "0.2rem" }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
