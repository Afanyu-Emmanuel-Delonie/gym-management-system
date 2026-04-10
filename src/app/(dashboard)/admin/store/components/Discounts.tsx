"use client"

import { useState, useEffect, useTransition } from "react"
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import { getDiscounts, createDiscount, toggleDiscount, deleteDiscount } from "@/actions/store"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Toast from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"
import { formatMoney } from "@/lib/utils"

type Discount = { id: string; code: string; type: string; value: any; minOrder: any; maxUses: number | null; usedCount: number; isActive: boolean; expiresAt: Date | null }

export default function Discounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => { getDiscounts().then((data) => setDiscounts(data as Discount[])) }, [])

  const toggle = (id: string, current: boolean) => {
    startTransition(async () => {
      await toggleDiscount(id, !current)
      setDiscounts((prev) => prev.map((d) => d.id === id ? { ...d, isActive: !current } : d))
    })
  }

  const remove = (id: string) => {
    startTransition(async () => {
      try {
        await deleteDiscount(id)
        setDiscounts((prev) => prev.filter((d) => d.id !== id))
        showToast("Discount deleted", "warning")
      } catch (e: any) { showToast(e.message, "error") }
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await createDiscount({
          code:      fd.get("code") as string,
          type:      fd.get("type") as "PERCENTAGE" | "FIXED",
          value:     Number(fd.get("value")),
          minOrder:  fd.get("minOrder") ? Number(fd.get("minOrder")) : undefined,
          maxUses:   fd.get("maxUses") ? Number(fd.get("maxUses")) : undefined,
          expiresAt: fd.get("expiresAt") ? new Date(fd.get("expiresAt") as string) : undefined,
        })
        const fresh = await getDiscounts()
        setDiscounts(fresh as Discount[])
        setShowForm(false)
        showToast("Discount created", "success")
      } catch (e: any) { showToast(e.message, "error") }
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>Discounts</h2>
          <p style={{ margin: "2px 0 0", fontSize: "var(--text-sm)" }}>{discounts.filter((d) => d.isActive).length} active codes</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}><Plus size={14} /> New Discount</Button>
      </div>

      {showForm && (
        <div className="card">
          <h3 style={{ margin: "0 0 1rem" }}>New Discount Code</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <Input name="code" label="Code" placeholder="GYM10" required />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>Type</label>
                <select name="type" className="input"><option value="PERCENTAGE">Percentage (%)</option><option value="FIXED">Fixed (RWF)</option></select>
              </div>
              <Input name="value" type="number" label="Value" placeholder="10" required />
              <Input name="minOrder" type="number" label="Min Order (RWF)" placeholder="Optional" />
              <Input name="maxUses" type="number" label="Max Uses" placeholder="Leave blank for unlimited" />
              <Input name="expiresAt" type="date" label="Expires At" />
            </div>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" size="sm" loading={isPending}>Create Discount</Button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface-raised)" }}>
              {["Code", "Type", "Value", "Min Order", "Usage", "Expires", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id} style={{ borderTop: "1px solid var(--color-border)", transition: "background 0.1s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-raised)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <td style={{ padding: "1rem 1.25rem", fontWeight: 700, fontSize: "var(--text-sm)", fontFamily: "monospace", color: "var(--color-primary)" }}>{d.code}</td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>{d.type}</td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)" }}>{d.type === "PERCENTAGE" ? `${Number(d.value)}%` : formatMoney(Number(d.value))}</td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{d.minOrder ? formatMoney(Number(d.minOrder)) : "—"}</td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{d.usedCount} / {d.maxUses ?? "∞"}</td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{d.expiresAt ? new Date(d.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Never"}</td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, padding: "0.25rem 0.65rem", borderRadius: "999px", backgroundColor: d.isActive ? "var(--color-success-subtle)" : "var(--color-surface-raised)", color: d.isActive ? "var(--color-success)" : "var(--color-text-muted)" }}>
                    {d.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => toggle(d.id, d.isActive)} style={{ background: "none", border: "none", cursor: "pointer", color: d.isActive ? "var(--color-warning)" : "var(--color-success)", display: "flex" }}>
                      {d.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                    <button onClick={() => remove(d.id)} disabled={isPending} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-danger)", display: "flex" }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
