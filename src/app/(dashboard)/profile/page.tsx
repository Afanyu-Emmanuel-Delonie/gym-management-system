"use client"

import { useState } from "react"
import { User, Lock, Bell, Shield } from "lucide-react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Toast from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"

const TABS = [
  { key: "profile",   label: "Profile",   icon: <User size={15} /> },
  { key: "security",  label: "Security",  icon: <Lock size={15} /> },
]

function ProfileTab() {
  const [pending, setPending] = useState(false)
  const { toast, showToast, hideToast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setPending(true)
    setTimeout(() => { setPending(false); showToast("Profile updated successfully", "success") }, 800)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* Avatar */}
      <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "var(--color-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-3xl)", fontWeight: 700, fontFamily: "var(--font-title)", flexShrink: 0 }}>
          A
        </div>
        <div>
          <h3 style={{ margin: "0 0 0.25rem" }}>Admin User</h3>
          <p style={{ margin: "0 0 0.75rem", fontSize: "var(--text-sm)" }}>admin@gym.com · ADMIN</p>
          <Button size="sm" variant="outline">Change Photo</Button>
        </div>
      </div>

      {/* Info form */}
      <div className="card">
        <h3 style={{ margin: "0 0 1.25rem" }}>Personal Information</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Input name="fullName"    label="Full Name"    defaultValue="Admin User"    required />
            <Input name="email"       label="Email"        defaultValue="admin@gym.com" type="email" required />
            <Input name="phoneNumber" label="Phone Number" defaultValue="+250 700 000 001" type="tel" />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-primary)" }}>Role</label>
              <input className="input" value="ADMIN" disabled style={{ backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-muted)", cursor: "not-allowed" }} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" size="sm" loading={pending}>Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SecurityTab() {
  const [pending, setPending] = useState(false)
  const { toast, showToast, hideToast } = useToast()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (fd.get("newPassword") !== fd.get("confirmPassword")) {
      showToast("Passwords do not match", "error"); return
    }
    setPending(true)
    setTimeout(() => { setPending(false); showToast("Password updated successfully", "success") }, 800)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="card">
        <h3 style={{ margin: "0 0 1.25rem" }}>Change Password</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "480px" }}>
          <Input name="currentPassword" type="password" label="Current Password" placeholder="••••••••" required />
          <Input name="newPassword"     type="password" label="New Password"     placeholder="••••••••" required />
          <Input name="confirmPassword" type="password" label="Confirm Password" placeholder="••••••••" required />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" size="sm" loading={pending}>Update Password</Button>
          </div>
        </form>
      </div>

      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <Shield size={18} style={{ color: "var(--color-primary)" }} />
          <h3 style={{ margin: 0 }}>Account Security</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { label: "Two-Factor Authentication", desc: "Add an extra layer of security", action: "Enable" },
            { label: "Active Sessions",           desc: "Manage devices logged into your account", action: "View" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid var(--color-border)" }}>
              <div>
                <p style={{ margin: 0, fontWeight: 500, fontSize: "var(--text-sm)", color: "var(--color-text-primary)" }}>{item.label}</p>
                <p style={{ margin: "2px 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{item.desc}</p>
              </div>
              <Button size="sm" variant="outline">{item.action}</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [tab, setTab] = useState("profile")

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
      {tab === "profile"  && <ProfileTab />}
      {tab === "security" && <SecurityTab />}
    </div>
  )
}
