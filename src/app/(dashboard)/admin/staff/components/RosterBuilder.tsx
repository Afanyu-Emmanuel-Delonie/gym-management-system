"use client"

import { useState, useEffect, useTransition } from "react"
import { Plus, Trash2, Send } from "lucide-react"
import { getStaffMembers, getAllRosters, getRosterById, createRoster, addRosterShift, deleteRosterShift, publishRoster } from "@/actions/staff"
import Button from "@/components/ui/Button"
import Toast from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const SHIFTS = [
  { key: "MORNING",  label: "Morning",  time: "06:00–14:00", color: "#f59e0b" },
  { key: "EVENING",  label: "Evening",  time: "14:00–22:00", color: "#6366f1" },
  { key: "FULL_DAY", label: "Full Day", time: "08:00–17:00", color: "#22c55e" },
]

type StaffMember = { id: string; fullName: string; role: string }
type ShiftRow = { id: string; staffId: string; day: number; shift: string }

export default function RosterBuilder() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [rosterId, setRosterId] = useState<string | null>(null)
  const [shifts, setShifts] = useState<ShiftRow[]>([])
  const [published, setPublished] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast, showToast, hideToast } = useToast()

  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - d.getDay() + 1)
    return d.toISOString().split("T")[0]
  })

  useEffect(() => {
    getStaffMembers().then((data) =>
      setStaff(data.filter((s) => s.role !== "ADMIN") as StaffMember[])
    )
    getAllRosters().then((rosters) => {
      const latest = rosters[0]
      if (latest) {
        setRosterId(latest.id)
        setPublished(latest.status === "PUBLISHED")
        getRosterById(latest.id).then((r) => {
          if (r) setShifts(r.shifts.map((s) => ({ id: s.id, staffId: s.staffId, day: s.day, shift: s.shift })))
        })
      }
    })
  }, [])

  const getEntry = (staffId: string, day: number) => shifts.find((s) => s.staffId === staffId && s.day === day)
  const shiftInfo = (key: string) => SHIFTS.find((s) => s.key === key)

  const handleCreate = () => {
    startTransition(async () => {
      try {
        const roster = await createRoster(new Date(weekStart))
        setRosterId(roster.id)
        setShifts([])
        setPublished(false)
        showToast("Roster created", "success")
      } catch (e: any) { showToast(e.message, "error") }
    })
  }

  const addEntry = (staffId: string, day: number, shiftType: string) => {
    if (!rosterId) return
    startTransition(async () => {
      const info = shiftInfo(shiftType)!
      const [start, end] = info.time.split("–")
      try {
        const shift = await addRosterShift({ rosterId, staffId, day, shift: shiftType as any, startTime: start, endTime: end })
        setShifts((prev) => {
          const filtered = prev.filter((s) => !(s.staffId === staffId && s.day === day))
          return [...filtered, { id: shift.id, staffId, day, shift: shiftType }]
        })
      } catch (e: any) { showToast(e.message, "error") }
    })
  }

  const removeEntry = (shiftId: string, staffId: string, day: number) => {
    startTransition(async () => {
      try {
        await deleteRosterShift(shiftId)
        setShifts((prev) => prev.filter((s) => s.id !== shiftId))
      } catch (e: any) { showToast(e.message, "error") }
    })
  }

  const handlePublish = () => {
    if (!rosterId) return
    startTransition(async () => {
      try {
        await publishRoster(rosterId)
        setPublished(true)
        showToast("Roster published", "success")
      } catch (e: any) { showToast(e.message, "error") }
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Roster Builder</h2>
          <p style={{ margin: "2px 0 0", fontSize: "var(--text-sm)" }}>Draft and publish weekly staff schedules</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Week starting</label>
            <input type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} className="input" style={{ width: "160px" }} />
          </div>
          <Button size="sm" variant="outline" onClick={handleCreate} loading={isPending}>New Roster</Button>
          {rosterId && (
            <Button size="sm" onClick={handlePublish} loading={isPending}>
              <Send size={14} /> {published ? "Published" : "Publish"}
            </Button>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {SHIFTS.map((s) => (
          <div key={s.key} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: s.color }} />
            <strong>{s.label}</strong> — {s.time}
          </div>
        ))}
      </div>

      {!rosterId ? (
        <div className="card" style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
          No roster yet. Select a week start date and click "New Roster".
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--color-surface-raised)" }}>
                <th style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", width: "160px" }}>Staff</th>
                {DAYS.map((d) => (
                  <th key={d} style={{ padding: "0.75rem 0.5rem", textAlign: "center", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase" }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id} style={{ borderTop: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "0.75rem 1.25rem" }}>
                    <div style={{ fontWeight: 500, fontSize: "var(--text-sm)", color: "var(--color-text-primary)" }}>{member.fullName}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{member.role.replace("_", " ")}</div>
                  </td>
                  {DAYS.map((_, dayIdx) => {
                    const entry = getEntry(member.id, dayIdx)
                    const info = entry ? shiftInfo(entry.shift) : null
                    return (
                      <td key={dayIdx} style={{ padding: "0.4rem 0.25rem", textAlign: "center" }}>
                        {entry && info ? (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", backgroundColor: `${info.color}20`, color: info.color, borderRadius: "var(--radius-sm)", padding: "0.25rem 0.5rem", fontSize: "10px", fontWeight: 600 }}>
                            {info.label}
                            <button onClick={() => removeEntry(entry.id, member.id, dayIdx)} style={{ background: "none", border: "none", cursor: "pointer", color: info.color, display: "flex", padding: 0 }}>
                              <Trash2 size={10} />
                            </button>
                          </div>
                        ) : (
                          <div style={{ position: "relative", display: "inline-block" }}>
                            <select onChange={(e) => { if (e.target.value) addEntry(member.id, dayIdx, e.target.value) }} value="" style={{ opacity: 0, position: "absolute", inset: 0, cursor: "pointer", width: "100%", height: "100%" }}>
                              <option value="">—</option>
                              {SHIFTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                            </select>
                            <Plus size={14} style={{ color: "var(--color-text-muted)" }} />
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {published && (
        <div style={{ padding: "0.75rem 1rem", backgroundColor: "var(--color-success-subtle)", borderRadius: "var(--radius-md)", color: "var(--color-success)", fontSize: "var(--text-sm)", fontWeight: 500 }}>
          ✓ Roster published for week of {new Date(weekStart).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      )}
    </div>
  )
}
