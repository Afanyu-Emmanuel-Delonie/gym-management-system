"use client"

import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Menu, Search, Bell, ChevronDown, Settings, LogOut, User, X, Check } from "lucide-react"
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

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "info" | "success" | "warning"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New subscription",
    message: "Alice Martin just subscribed to the Pro plan.",
    time: "2 min ago",
    read: false,
    type: "success",
  },
  {
    id: "2",
    title: "Staff update",
    message: "Coach schedule updated for next week.",
    time: "1 hr ago",
    read: false,
    type: "info",
  },
  {
    id: "3",
    title: "Payment pending",
    message: "Invoice #1042 is awaiting approval.",
    time: "3 hrs ago",
    read: true,
    type: "warning",
  },
]

const typeColors: Record<string, string> = {
  info:    "var(--color-primary)",
  success: "#22c55e",
  warning: "#f59e0b",
}

export default function Header({ fullName, role }: { fullName: string; role: string }) {
  const pathname = usePathname()
  const { toggle } = useSidebar()
  const title = pageTitles[pathname] ?? "Dashboard"

  const [searchOpen, setSearchOpen]           = useState(false)
  const [searchQuery, setSearchQuery]         = useState("")
  const [notifOpen, setNotifOpen]             = useState(false)
  const [profileOpen, setProfileOpen]         = useState(false)
  const [notifications, setNotifications]     = useState(mockNotifications)

  const searchRef  = useRef<HTMLDivElement>(null)
  const notifRef   = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const unread = notifications.filter((n) => !n.read).length
  const initials = fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  /* close dropdowns on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))   setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
        setSearchQuery("")
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

  const markRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))

  return (
    <>
      <style>{`
        .hdr-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.45rem;
          border-radius: var(--radius-sm, 6px);
          transition: background 0.15s, color 0.15s;
          position: relative;
        }
        .hdr-icon-btn:hover {
          background: var(--color-surface-hover, rgba(0,0,0,0.06));
          color: var(--color-text-primary);
        }
        .hdr-badge {
          position: absolute;
          top: 2px; right: 2px;
          min-width: 16px; height: 16px;
          border-radius: 8px;
          background: #ef4444;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          pointer-events: none;
          border: 2px solid var(--color-surface);
        }
        .hdr-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md, 10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.13);
          z-index: 200;
          animation: dropIn 0.15s ease;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .hdr-search-input {
          border: none;
          outline: none;
          background: transparent;
          color: var(--color-text-primary);
          font-size: var(--text-sm, 0.875rem);
          width: 220px;
        }
        .hdr-search-input::placeholder { color: var(--color-text-muted); }

        /* Desktop search bar — always visible on large screens */
        .hdr-search-desktop {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--color-surface-hover, rgba(0,0,0,0.05));
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm, 6px);
          padding: 0.35rem 0.65rem;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .hdr-search-desktop:focus-within {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent);
        }
        /* Mobile search icon — hidden on large screens */
        .hdr-search-mobile { display: none; }

        @media (max-width: 767px) {
          .hdr-search-desktop { display: none; }
          .hdr-search-mobile  { display: flex; }
        }
        .hdr-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700;
          font-size: var(--text-sm, 0.875rem);
          flex-shrink: 0;
          letter-spacing: 0.03em;
        }
        .hdr-profile-btn {
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.3rem 0.5rem;
          border-radius: var(--radius-sm, 6px);
          transition: background 0.15s;
        }
        .hdr-profile-btn:hover { background: var(--color-surface-hover, rgba(0,0,0,0.06)); }
        .hdr-menu-item {
          display: flex; align-items: center; gap: 0.65rem;
          padding: 0.6rem 1rem;
          font-size: var(--text-sm, 0.875rem);
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
          white-space: nowrap;
          background: none; border: none; width: 100%; text-align: left;
        }
        .hdr-menu-item:hover { background: var(--color-surface-hover, rgba(0,0,0,0.06)); color: var(--color-text-primary); }
        .hdr-menu-item.danger:hover { background: #fef2f2; color: #dc2626; }
        .hdr-notif-item {
          display: flex; gap: 0.75rem;
          padding: 0.85rem 1rem;
          cursor: pointer;
          transition: background 0.12s;
          border-bottom: 1px solid var(--color-border);
        }
        .hdr-notif-item:last-child { border-bottom: none; }
        .hdr-notif-item:hover { background: var(--color-surface-hover, rgba(0,0,0,0.04)); }
        .hdr-notif-dot {
          width: 8px; height: 8px; border-radius: 50%;
          flex-shrink: 0; margin-top: 5px;
        }
        .hdr-divider {
          height: 1px;
          background: var(--color-border);
          margin: 0.25rem 0;
        }
      `}</style>

      <header
        style={{
          backgroundColor: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          padding: "0 1.25rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          gap: "1rem",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* LEFT — hamburger + title */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button className="hdr-icon-btn" onClick={toggle} aria-label="Toggle sidebar">
            <Menu size={20} />
          </button>
          <h2
            style={{
              margin: 0,
              fontSize: "var(--text-xl, 1rem)",
              fontWeight: 600,
              color: "var(--color-text-primary)",
            }}
          >
            {title}
          </h2>
        </div>

        {/* RIGHT — search, notifications, profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>

          {/* ── Search: always-visible bar on desktop, icon on mobile ── */}

          {/* Desktop */}
          <div className="hdr-search-desktop">
            <Search size={15} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
            <input
              className="hdr-search-input"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Mobile */}
          <div ref={searchRef} className="hdr-search-mobile" style={{ position: "relative" }}>
            {searchOpen ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "var(--color-surface-hover, rgba(0,0,0,0.05))",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm, 6px)",
                  padding: "0.35rem 0.65rem",
                  animation: "dropIn 0.15s ease",
                }}
              >
                <Search size={15} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                <input
                  autoFocus
                  className="hdr-search-input"
                  style={{ width: "140px" }}
                  placeholder="Search…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="hdr-icon-btn"
                  style={{ padding: "0.1rem" }}
                  onClick={() => { setSearchOpen(false); setSearchQuery("") }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button className="hdr-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Open search">
                <Search size={19} />
              </button>
            )}
          </div>

          {/* ── Notifications ── */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <button
              className="hdr-icon-btn"
              onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false) }}
              aria-label="Notifications"
            >
              <Bell size={19} />
              {unread > 0 && <span className="hdr-badge">{unread}</span>}
            </button>

            {notifOpen && (
              <div className="hdr-dropdown" style={{ width: "340px" }}>
                {/* header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.85rem 1rem 0.6rem",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "var(--text-sm, 0.875rem)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    Notifications
                    {unread > 0 && (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          background: "var(--color-primary)",
                          color: "#fff",
                          borderRadius: "999px",
                          fontSize: "11px",
                          padding: "1px 7px",
                          fontWeight: 700,
                        }}
                      >
                        {unread}
                      </span>
                    )}
                  </span>
                  {unread > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "var(--color-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontWeight: 500,
                      }}
                    >
                      <Check size={12} /> Mark all read
                    </button>
                  )}
                </div>

                {/* list */}
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="hdr-notif-item"
                      style={{ opacity: n.read ? 0.6 : 1 }}
                      onClick={() => markRead(n.id)}
                    >
                      <span
                        className="hdr-notif-dot"
                        style={{ background: n.read ? "transparent" : typeColors[n.type] }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "var(--text-sm, 0.875rem)",
                            fontWeight: n.read ? 400 : 600,
                            color: "var(--color-text-primary)",
                          }}
                        >
                          {n.title}
                        </p>
                        <p
                          style={{
                            margin: "2px 0 0",
                            fontSize: "12px",
                            color: "var(--color-text-muted)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {n.message}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--color-text-muted)",
                          flexShrink: 0,
                          alignSelf: "flex-start",
                          marginTop: "2px",
                        }}
                      >
                        {n.time}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ padding: "0.6rem 1rem", borderTop: "1px solid var(--color-border)" }}>
                  <button
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "var(--text-sm, 0.875rem)",
                      color: "var(--color-primary)",
                      fontWeight: 500,
                      padding: "0.25rem",
                    }}
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div
            style={{
              width: "1px",
              height: "28px",
              background: "var(--color-border)",
              margin: "0 0.35rem",
            }}
          />

          {/* ── Profile ── */}
          <div ref={profileRef} style={{ position: "relative" }}>
            <button
              className="hdr-profile-btn"
              onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false) }}
              aria-label="Profile menu"
            >
              <div className="hdr-avatar">{initials}</div>
              <div className="hidden md:block" style={{ textAlign: "left" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "var(--text-sm, 0.875rem)",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    lineHeight: 1.2,
                  }}
                >
                  {fullName}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    color: "var(--color-text-muted)",
                    textTransform: "capitalize",
                    lineHeight: 1.2,
                  }}
                >
                  {role.replace("_", " ")}
                </p>
              </div>
              <ChevronDown
                size={14}
                className="hidden md:block"
                style={{
                  color: "var(--color-text-muted)",
                  transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                  marginLeft: "2px",
                }}
              />
            </button>

            {profileOpen && (
              <div className="hdr-dropdown" style={{ minWidth: "200px" }}>
                <div style={{ padding: "0.85rem 1rem 0.65rem" }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "var(--text-sm, 0.875rem)",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {fullName}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--color-text-muted)" }}>
                    {role.replace("_", " ")}
                  </p>
                </div>
                <div className="hdr-divider" />
                <button className="hdr-menu-item">
                  <User size={15} /> My Profile
                </button>
                <button className="hdr-menu-item">
                  <Settings size={15} /> Settings
                </button>
                <div className="hdr-divider" />
                <button className="hdr-menu-item danger">
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}