"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  page: number
  total: number
  pageSize: number
  onPage: (p: number) => void
}

export default function Pagination({ page, total, pageSize, onPage }: Props) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to   = Math.min(page * pageSize, total)

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.25rem", borderTop: "1px solid var(--color-border)" }}>
      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
        Showing {from}–{to} of {total}
      </span>
      <div style={{ display: "flex", gap: "0.25rem" }}>
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          style={{ display: "flex", alignItems: "center", padding: "0.3rem 0.5rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-surface)", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, color: "var(--color-text-secondary)" }}
        >
          <ChevronLeft size={14} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce<(number | "...")[]>((acc, p, i, arr) => {
            if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...")
            acc.push(p)
            return acc
          }, [])
          .map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} style={{ padding: "0.3rem 0.5rem", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>…</span>
            ) : (
              <button
                key={p}
                onClick={() => onPage(p as number)}
                style={{ padding: "0.3rem 0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", fontWeight: 500, cursor: "pointer", background: page === p ? "var(--color-primary)" : "var(--color-surface)", color: page === p ? "#fff" : "var(--color-text-secondary)" }}
              >
                {p}
              </button>
            )
          )}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          style={{ display: "flex", alignItems: "center", padding: "0.3rem 0.5rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-surface)", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1, color: "var(--color-text-secondary)" }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
