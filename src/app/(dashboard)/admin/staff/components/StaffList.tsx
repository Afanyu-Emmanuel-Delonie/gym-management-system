"use client"

import { useState, useTransition, useEffect } from "react"
import { UserPlus, Trash2, Mail, Phone } from "lucide-react"
import { getStaffMembers, createStaffMember, deleteStaffMember } from "@/actions/staff"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Toast from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"

const ROLE_BADGE: Record<string, { bg: string; color: string }> = {
  ADMIN:        { bg: "#fef2f2", color: "#c60b0b" },
  SALES_AGENT:  { bg: "#eff6ff", color: "#2563eb" },
  COACH:        { bg: "#f0fdf4", color: "#16a34a" },
  NUTRITIONIST: { bg: "#fefce8", color: "#ca8a04" },
}

type Staff = { id: string; fullName: string; email: string; phoneNumber: string | null; role: string; createdAt: Date }

export default function StaffList() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    getStaffMembers().then((data) => setStaff(data as Staff[]))
  }, [])

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        const newStaff = await createStaffMember({
          email:       fd.get("email") as string,
          fullName:    fd.get("fullName") as string,
          phoneNumber: fd.get("phoneNumber") as string || undefined,
          role:        fd.get("role") as "SALES_AGENT" | "COACH" | "NUTRITIONIST",
        })
        setStaff((prev) => [newStaff as Staff, ...prev])
        setShowForm(false)
        showToast("Staff member added", "success")
      } catch (err: any) { showToast(err.message, "error") }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteStaffMember(id)
        setStaff((prev) => prev.filter((s) => s.id !== id))
        showToast("Staff member removed", "warning")
      } catch (err: any) { showToast(err.message, "error") }
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>Staff Members</h2>
          <p style={{ margin: "2px 0 0", fontSize: "var(--text-sm)" }}>{staff.length} total staff</p>
        </div>
        <Button onClick={() => setShowForm(true)} size="sm">
          <UserPlus size={15} /> Add Staff
        </Button>
      </div>

      {showForm && (
        <div className="card">
          <h3 style={{ margin: "0 0 1rem" }}>New Staff Member</h3>
          <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Input name="fullName" label="Full Name" placeholder="John Doe" required />
              <Input name="email" type="email" label="Email" placeholder="john@gym.com" required />
              <Input name="phoneNumber" type="tel" label="Phone Number" placeholder="+250 700 000 000" />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>Role</label>
                <select name="role" className="input">
                  <option value="SALES_AGENT">Sales Agent</option>
                  <option value="COACH">Coach</option>
                  <option value="NUTRITIONIST">Nutritionist</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" size="sm" loading={isPending}>Add Staff Member</Button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface-raised)" }}>
              {["Staff Member", "Contact", "Role", "Joined", "Actions"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} style={{ borderTop: "1px solid var(--color-border)", transition: "background 0.1s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-raised)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "var(--color-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "var(--text-sm)", flexShrink: 0 }}>
                      {s.fullName.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 500, fontSize: "var(--text-sm)", color: "var(--color-text-primary)" }}>{s.fullName}</span>
                  </div>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                      <Mail size={11} /> {s.email}
                    </div>
                    {s.phoneNumber && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                        <Phone size={11} /> {s.phoneNumber}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, padding: "0.25rem 0.65rem", borderRadius: "999px", backgroundColor: ROLE_BADGE[s.role]?.bg, color: ROLE_BADGE[s.role]?.color }}>
                    {s.role.replace("_", " ")}
                  </span>
                </td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                  {new Date(s.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <button onClick={() => handleDelete(s.id)} disabled={isPending}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-danger)", display: "flex", padding: "0.25rem" }}>
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
