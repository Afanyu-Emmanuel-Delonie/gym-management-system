"use client"

import { useState, useEffect, useTransition } from "react"
import { LogIn, LogOut, CheckCircle, XCircle, Clock } from "lucide-react"
import { getStaffAttendance, checkOut } from "@/actions/staff"
import Button from "@/components/ui/Button"
import Toast from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"

const STATUS_STYLES: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  PRESENT:  { bg: "var(--color-success-subtle)", color: "var(--color-success)", icon: <CheckCircle size={13} /> },
  ABSENT:   { bg: "var(--color-danger-subtle)",  color: "var(--color-danger)",  icon: <XCircle size={13} /> },
  LATE:     { bg: "var(--color-warning-subtle)", color: "var(--color-warning)", icon: <Clock size={13} /> },
  HALF_DAY: { bg: "#ede9fe",                     color: "#6366f1",              icon: <Clock size={13} /> },
}

type AttendanceRecord = {
  id: string
  staffId: string
  checkIn: Date | null
  checkOut: Date | null
  status: string
  staff: { fullName: string; role: string }
}

export default function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [isPending, startTransition] = useTransition()
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    getStaffAttendance(new Date(selectedDate)).then((data) => setRecords(data as AttendanceRecord[]))
  }, [selectedDate])

  const handleCheckOut = (staffId: string) => {
    startTransition(async () => {
      try {
        const updated = await checkOut(staffId)
        setRecords((prev) => prev.map((r) => r.staffId === staffId ? { ...r, checkOut: updated.checkOut } : r))
        showToast("Checked out successfully", "success")
      } catch (e: any) { showToast(e.message, "error") }
    })
  }

  const fmt = (d: Date | null) => d ? new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : null

  const totalPresent = records.filter((r) => r.status === "PRESENT").length
  const totalAbsent  = records.filter((r) => r.status === "ABSENT").length
  const totalLate    = records.filter((r) => r.status === "LATE").length

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Attendance</h2>
          <p style={{ margin: "2px 0 0", fontSize: "var(--text-sm)" }}>Track staff check-ins and check-outs</p>
        </div>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="input" style={{ width: "160px" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
        {[
          { label: "Present", value: totalPresent, color: "var(--color-success)", bg: "var(--color-success-subtle)" },
          { label: "Absent",  value: totalAbsent,  color: "var(--color-danger)",  bg: "var(--color-danger-subtle)" },
          { label: "Late",    value: totalLate,     color: "var(--color-warning)", bg: "var(--color-warning-subtle)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "var(--radius-md)", backgroundColor: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-xl)", fontWeight: 700, fontFamily: "var(--font-title)" }}>
              {s.value}
            </div>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface-raised)" }}>
              {["Staff", "Role", "Check In", "Check Out", "Duration", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>No attendance records for this date</td></tr>
            ) : records.map((r) => {
              const style = STATUS_STYLES[r.status] ?? STATUS_STYLES.PRESENT
              const checkInStr  = fmt(r.checkIn)
              const checkOutStr = fmt(r.checkOut)
              const duration = r.checkIn && r.checkOut
                ? (() => {
                    const mins = (new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / 60000
                    return `${Math.floor(mins / 60)}h ${Math.round(mins % 60)}m`
                  })()
                : "—"

              return (
                <tr key={r.id} style={{ borderTop: "1px solid var(--color-border)", transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-raised)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--color-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "var(--text-xs)", flexShrink: 0 }}>
                        {r.staff.fullName.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 500, fontSize: "var(--text-sm)", color: "var(--color-text-primary)" }}>{r.staff.fullName}</span>
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{r.staff.role.replace("_", " ")}</td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    {checkInStr ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "var(--text-sm)", color: "var(--color-success)" }}>
                        <LogIn size={13} /> {checkInStr}
                      </div>
                    ) : <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>—</span>}
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    {checkOutStr ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "var(--text-sm)", color: "var(--color-danger)" }}>
                        <LogOut size={13} /> {checkOutStr}
                      </div>
                    ) : <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>Active</span>}
                  </td>
                  <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{duration}</td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "var(--text-xs)", fontWeight: 600, padding: "0.25rem 0.65rem", borderRadius: "999px", backgroundColor: style.bg, color: style.color }}>
                      {style.icon} {r.status.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    {r.checkIn && !r.checkOut && (
                      <Button size="sm" variant="outline" loading={isPending} onClick={() => handleCheckOut(r.staffId)}>
                        <LogOut size={13} /> Check Out
                      </Button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
