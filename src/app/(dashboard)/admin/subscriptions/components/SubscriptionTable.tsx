"use client"

import { useState, useEffect, useTransition } from "react"
import { Search, CheckCircle, XCircle, Key } from "lucide-react"
import { getAllSubscriptions, confirmSubscriptionPayment, cancelSubscription } from "@/actions/subscriptions"
import { STATUS_STYLES, TYPE_STYLES } from "@/constants/subscriptions"
import Pagination from "@/components/ui/Pagination"
import Toast from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"

const PAGE_SIZE = 10

type Sub = {
  id: string; type: string; status: string; accessCode: string | null
  startDate: string | null; endDate: string | null
  profile: { fullName: string; email: string; phoneNumber?: string | null }
}
type StatusFilter = "ALL" | "ACTIVE" | "PENDING" | "EXPIRED" | "CANCELLED"

export default function SubscriptionTable() {
  const [subs, setSubs]       = useState<Sub[]>([])
  const [total, setTotal]     = useState(0)
  const [page, setPage]       = useState(1)
  const [filter, setFilter]   = useState<StatusFilter>("ALL")
  const [search, setSearch]   = useState("")
  const [query, setQuery]     = useState("")
  const [isPending, start]    = useTransition()
  const { toast, showToast, hideToast } = useToast()

  const load = (p: number, f: StatusFilter, q: string) => {
    start(async () => {
      const res = await getAllSubscriptions(p, PAGE_SIZE, f, q)
      setSubs(res.data as Sub[])
      setTotal(res.total)
    })
  }

  useEffect(() => { load(page, filter, query) }, [page, filter, query])

  const handleFilter = (f: StatusFilter) => { setFilter(f); setPage(1) }
  const handleSearch = () => { setQuery(search); setPage(1) }

  const confirm = (id: string) => {
    start(async () => {
      try {
        const updated = await confirmSubscriptionPayment(id)
        showToast(`Activated. Code: ${updated.accessCode}`, "success")
        load(page, filter, query)
      } catch (e: any) { showToast(e.message, "error") }
    })
  }

  const cancel = (id: string) => {
    start(async () => {
      try {
        await cancelSubscription(id)
        showToast("Subscription cancelled", "warning")
        load(page, filter, query)
      } catch (e: any) { showToast(e.message, "error") }
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", gap: "0.25rem" }}>
          {(["ALL", "ACTIVE", "PENDING", "EXPIRED", "CANCELLED"] as StatusFilter[]).map((f) => (
            <button key={f} onClick={() => handleFilter(f)} style={{
              padding: "0.35rem 0.85rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)",
              fontSize: "var(--text-xs)", fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
              backgroundColor: filter === f ? "var(--color-primary)" : "var(--color-surface)",
              color: filter === f ? "#fff" : "var(--color-text-secondary)",
            }}>
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "0.35rem 0.75rem", backgroundColor: "var(--color-surface)" }}>
            <Search size={14} style={{ color: "var(--color-text-muted)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search member..."
              style={{ border: "none", outline: "none", fontSize: "var(--text-sm)", color: "var(--color-text-primary)", background: "transparent", width: "180px" }}
            />
          </div>
          <button onClick={handleSearch} style={{ padding: "0.35rem 0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", fontWeight: 500, cursor: "pointer", background: "var(--color-surface)", color: "var(--color-text-secondary)" }}>
            Search
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden", opacity: isPending ? 0.6 : 1, transition: "opacity 0.2s" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface-raised)" }}>
              {["Member", "Plan", "Status", "Access Code", "Start", "End", "Actions"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subs.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>No subscriptions found</td></tr>
            ) : subs.map((s) => (
              <tr key={s.id} style={{ borderTop: "1px solid var(--color-border)", transition: "background 0.1s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-raised)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--color-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "var(--text-xs)", flexShrink: 0 }}>
                      {s.profile.fullName.charAt(0)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 500, fontSize: "var(--text-sm)", color: "var(--color-text-primary)" }}>{s.profile.fullName}</p>
                      <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{s.profile.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, padding: "0.25rem 0.65rem", borderRadius: "999px", backgroundColor: TYPE_STYLES[s.type]?.bg, color: TYPE_STYLES[s.type]?.color }}>{s.type}</span>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, padding: "0.25rem 0.65rem", borderRadius: "999px", backgroundColor: STATUS_STYLES[s.status]?.bg, color: STATUS_STYLES[s.status]?.color }}>{s.status}</span>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  {s.accessCode
                    ? <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "var(--text-sm)", fontWeight: 600, fontFamily: "monospace" }}><Key size={13} style={{ color: "var(--color-primary)" }} />{s.accessCode}</div>
                    : <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>—</span>}
                </td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                  {s.startDate ? new Date(s.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                </td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                  {s.endDate ? new Date(s.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {s.status === "PENDING" && (
                      <button onClick={() => confirm(s.id)} disabled={isPending} title="Activate" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-success)", display: "flex", padding: "0.2rem" }}>
                        <CheckCircle size={17} />
                      </button>
                    )}
                    {(s.status === "ACTIVE" || s.status === "PENDING") && (
                      <button onClick={() => cancel(s.id)} disabled={isPending} title="Cancel" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-danger)", display: "flex", padding: "0.2rem" }}>
                        <XCircle size={17} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} total={total} pageSize={PAGE_SIZE} onPage={setPage} />
      </div>
    </div>
  )
}
