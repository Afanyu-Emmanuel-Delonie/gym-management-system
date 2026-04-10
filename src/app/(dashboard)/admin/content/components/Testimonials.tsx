"use client"

import { useState, useEffect, useTransition } from "react"
import { CheckCircle, Trash2, Star } from "lucide-react"
import { getTestimonials, approveTestimonial, deleteTestimonial } from "@/actions/content"
import Pagination from "@/components/ui/Pagination"
import Toast from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"

const PAGE_SIZE = 10

type Testimonial = { id: string; content: string; rating: number; isApproved: boolean; createdAt: string; profile: { fullName: string } }

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [total, setTotal]               = useState(0)
  const [page, setPage]                 = useState(1)
  const [filter, setFilter]             = useState<"ALL" | "PENDING" | "APPROVED">("ALL")
  const [isPending, start]              = useTransition()
  const { toast, showToast, hideToast } = useToast()

  const load = (p: number, f: string) => {
    start(async () => {
      const res = await getTestimonials(p, PAGE_SIZE, f)
      setTestimonials(res.data as Testimonial[])
      setTotal(res.total)
    })
  }

  useEffect(() => { load(page, filter) }, [page, filter])

  const handleFilter = (f: "ALL" | "PENDING" | "APPROVED") => { setFilter(f); setPage(1) }

  const approve = (id: string) => {
    start(async () => {
      try { await approveTestimonial(id); showToast("Testimonial approved", "success"); load(page, filter) }
      catch (e: any) { showToast(e.message, "error") }
    })
  }

  const remove = (id: string) => {
    start(async () => {
      try { await deleteTestimonial(id); showToast("Testimonial removed", "warning"); load(page, filter) }
      catch (e: any) { showToast(e.message, "error") }
    })
  }

  const pending = testimonials.filter((t) => !t.isApproved).length

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>Testimonials</h2>
          <p style={{ margin: "2px 0 0", fontSize: "var(--text-sm)" }}>{pending} pending on this page</p>
        </div>
        <div style={{ display: "flex", gap: "0.25rem" }}>
          {(["ALL", "PENDING", "APPROVED"] as const).map((f) => (
            <button key={f} onClick={() => handleFilter(f)} style={{
              padding: "0.3rem 0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)",
              fontSize: "var(--text-xs)", fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
              backgroundColor: filter === f ? "var(--color-primary)" : "var(--color-surface)",
              color: filter === f ? "#fff" : "var(--color-text-secondary)",
            }}>{f.charAt(0) + f.slice(1).toLowerCase()}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", opacity: isPending ? 0.6 : 1, transition: "opacity 0.2s" }}>
        {testimonials.map((t) => (
          <div key={t.id} className="card" style={{ borderLeft: t.isApproved ? "3px solid var(--color-success)" : "3px solid var(--color-warning)", padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "var(--color-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "var(--text-sm)", flexShrink: 0 }}>{t.profile.fullName.charAt(0)}</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--color-text-primary)" }}>{t.profile.fullName}</p>
                  <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={11} style={{ color: i < t.rating ? "#f59e0b" : "var(--color-border)", fill: i < t.rating ? "#f59e0b" : "none" }} />
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{new Date(t.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: "999px", backgroundColor: t.isApproved ? "var(--color-success-subtle)" : "var(--color-warning-subtle)", color: t.isApproved ? "var(--color-success)" : "var(--color-warning)" }}>
                  {t.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
            </div>
            <p style={{ margin: "0.5rem 0 0.75rem", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>"{t.content}"</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {!t.isApproved && (
                <button onClick={() => approve(t.id)} disabled={isPending} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "var(--text-xs)", padding: "0.3rem 0.75rem", borderRadius: "var(--radius-sm)", border: "none", backgroundColor: "var(--color-success-subtle)", color: "var(--color-success)", cursor: "pointer", fontWeight: 500 }}>
                  <CheckCircle size={13} /> Approve
                </button>
              )}
              <button onClick={() => remove(t.id)} disabled={isPending} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "var(--text-xs)", padding: "0.3rem 0.75rem", borderRadius: "var(--radius-sm)", border: "none", backgroundColor: "var(--color-danger-subtle)", color: "var(--color-danger)", cursor: "pointer", fontWeight: 500 }}>
                <Trash2 size={13} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <Pagination page={page} total={total} pageSize={PAGE_SIZE} onPage={setPage} />
      </div>
    </div>
  )
}
