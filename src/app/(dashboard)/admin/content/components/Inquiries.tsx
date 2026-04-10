"use client"

import { useState, useEffect, useTransition } from "react"
import { Mail, Phone, Eye, X, MessageCircle } from "lucide-react"
import { getInquiries, markInquiryRead } from "@/actions/content"
import { INQUIRY_STATUS_STYLES } from "@/constants/store-content"
import Pagination from "@/components/ui/Pagination"

const PAGE_SIZE = 10

type Inquiry = { id: string; name: string; email: string; phone: string | null; subject: string; message: string; status: string; createdAt: string }
type Status = "ALL" | "UNREAD" | "READ" | "REPLIED"

function buildWhatsAppUrl(phone: string, inquiry: Inquiry) {
  const clean = phone.replace(/\s+/g, "")
  const text = encodeURIComponent(`Hi ${inquiry.name}, thank you for reaching out about "${inquiry.subject}". `)
  return `https://wa.me/${clean}?text=${text}`
}

function InquiryModal({ inquiry, onClose }: { inquiry: Inquiry; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "#00000060", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
      <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-lg)", width: "100%", maxWidth: "560px", boxShadow: "var(--shadow-lg)", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>{inquiry.subject}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}><X size={18} /></button>
        </div>
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", padding: "0.75rem", backgroundColor: "var(--color-surface-raised)", borderRadius: "var(--radius-md)" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "var(--color-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>{inquiry.name.charAt(0)}</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--color-text-primary)" }}>{inquiry.name}</p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "3px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}><Mail size={11} /> {inquiry.email}</div>
                {inquiry.phone && <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}><Phone size={11} /> {inquiry.phone}</div>}
              </div>
            </div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", flexShrink: 0 }}>{new Date(inquiry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
          </div>
          <p style={{ margin: "0 0 1.5rem", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.7, padding: "1rem", backgroundColor: "var(--color-surface-raised)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--color-border)" }}>{inquiry.message}</p>
          {inquiry.phone ? (
            <a href={buildWhatsAppUrl(inquiry.phone, inquiry)} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", backgroundColor: "#25d366", color: "#fff", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <MessageCircle size={16} /> Reply on WhatsApp
            </a>
          ) : (
            <div style={{ padding: "0.75rem 1rem", backgroundColor: "var(--color-surface-raised)", borderRadius: "var(--radius-md)", color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
              No phone number — contact via email: <strong>{inquiry.email}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [filter, setFilter]       = useState<Status>("ALL")
  const [selected, setSelected]   = useState<Inquiry | null>(null)
  const [, start]                 = useTransition()

  const load = (p: number, f: Status) => {
    start(async () => {
      const res = await getInquiries(p, PAGE_SIZE, f)
      setInquiries(res.data as Inquiry[])
      setTotal(res.total)
    })
  }

  useEffect(() => { load(page, filter) }, [page, filter])

  const handleFilter = (f: Status) => { setFilter(f); setPage(1) }

  const markRead = (id: string) => {
    start(async () => {
      await markInquiryRead(id)
      setInquiries((prev) => prev.map((i) => i.id === id && i.status === "UNREAD" ? { ...i, status: "READ" } : i))
    })
  }

  const unread = inquiries.filter((i) => i.status === "UNREAD").length

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {selected && <InquiryModal inquiry={selected} onClose={() => setSelected(null)} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>Contact Inquiries</h2>
          <p style={{ margin: "2px 0 0", fontSize: "var(--text-sm)" }}>{unread} unread on this page</p>
        </div>
        <div style={{ display: "flex", gap: "0.25rem" }}>
          {(["ALL", "UNREAD", "READ", "REPLIED"] as Status[]).map((f) => (
            <button key={f} onClick={() => handleFilter(f)} style={{
              padding: "0.3rem 0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)",
              fontSize: "var(--text-xs)", fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
              backgroundColor: filter === f ? "var(--color-primary)" : "var(--color-surface)",
              color: filter === f ? "#fff" : "var(--color-text-secondary)",
            }}>{f.charAt(0) + f.slice(1).toLowerCase()}</button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface-raised)" }}>
              {["Sender", "Subject", "Status", "Date", "Actions"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq.id}
                style={{ borderTop: "1px solid var(--color-border)", transition: "background 0.1s", fontWeight: inq.status === "UNREAD" ? 600 : 400, cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-raised)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                onClick={() => { setSelected(inq); markRead(inq.id) }}
              >
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--color-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "var(--text-xs)", flexShrink: 0 }}>{inq.name.charAt(0)}</div>
                    <div>
                      <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-primary)" }}>{inq.name}</p>
                      <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{inq.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-sm)", color: "var(--color-text-primary)", maxWidth: "200px" }}>
                  <p style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inq.subject}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inq.message}</p>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, padding: "0.25rem 0.65rem", borderRadius: "999px", backgroundColor: INQUIRY_STATUS_STYLES[inq.status]?.bg, color: INQUIRY_STATUS_STYLES[inq.status]?.color }}>{inq.status}</span>
                </td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                  {new Date(inq.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <button onClick={(e) => { e.stopPropagation(); setSelected(inq); markRead(inq.id) }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)", display: "flex", padding: "0.2rem" }}><Eye size={15} /></button>
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
