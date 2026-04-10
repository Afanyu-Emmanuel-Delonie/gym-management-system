"use client"

import { useState, useEffect, useTransition } from "react"
import { Search, Truck, Package } from "lucide-react"
import { getAllOrders, updateOrderStatus, cancelOrder } from "@/actions/store"
import { ORDER_STATUS_STYLES } from "@/constants/store-content"
import Pagination from "@/components/ui/Pagination"
import Toast from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"
import { formatMoney } from "@/lib/utils"

const PAGE_SIZE = 10

type Order = {
  id: string; status: string; deliveryType: string; finalAmount: any; createdAt: string
  client: { fullName: string; email: string }
  items: { id: string }[]
}

const STATUS_FLOW: Record<string, string> = {
  PENDING: "PAID", PAID: "PROCESSING", PROCESSING: "SHIPPED", SHIPPED: "DELIVERED", DELIVERED: "COMPLETED",
}

export default function Orders() {
  const [orders, setOrders]   = useState<Order[]>([])
  const [total, setTotal]     = useState(0)
  const [page, setPage]       = useState(1)
  const [filter, setFilter]   = useState("ALL")
  const [search, setSearch]   = useState("")
  const [query, setQuery]     = useState("")
  const [isPending, start]    = useTransition()
  const { toast, showToast, hideToast } = useToast()

  const load = (p: number, f: string, q: string) => {
    start(async () => {
      const res = await getAllOrders(f === "ALL" ? undefined : f as any, p, PAGE_SIZE, q)
      setOrders(res.data as Order[])
      setTotal(res.total)
    })
  }

  useEffect(() => { load(page, filter, query) }, [page, filter, query])

  const handleFilter = (f: string) => { setFilter(f); setPage(1) }
  const handleSearch = () => { setQuery(search); setPage(1) }

  const advance = (id: string, current: string) => {
    const next = STATUS_FLOW[current]
    if (!next) return
    start(async () => {
      try {
        await updateOrderStatus(id, next as any)
        showToast(`Order moved to ${next}`, "success")
        load(page, filter, query)
      } catch (e: any) { showToast(e.message, "error") }
    })
  }

  const cancel = (id: string) => {
    start(async () => {
      try {
        await cancelOrder(id)
        showToast("Order cancelled", "warning")
        load(page, filter, query)
      } catch (e: any) { showToast(e.message, "error") }
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
          {["ALL", "PENDING", "PAID", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"].map((f) => (
            <button key={f} onClick={() => handleFilter(f)} style={{
              padding: "0.3rem 0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)",
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
            <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Search client..." style={{ border: "none", outline: "none", fontSize: "var(--text-sm)", background: "transparent", width: "160px" }} />
          </div>
          <button onClick={handleSearch} style={{ padding: "0.35rem 0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", fontWeight: 500, cursor: "pointer", background: "var(--color-surface)", color: "var(--color-text-secondary)" }}>Search</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden", opacity: isPending ? 0.6 : 1, transition: "opacity 0.2s" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface-raised)" }}>
              {["Order", "Client", "Items", "Total", "Delivery", "Status", "Date", "Actions"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>No orders found</td></tr>
            ) : orders.map((o) => (
              <tr key={o.id} style={{ borderTop: "1px solid var(--color-border)", transition: "background 0.1s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-raised)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)" }}>#{o.id.slice(-6).toUpperCase()}</td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-primary)" }}>{o.client.fullName}</p>
                  <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{o.client.email}</p>
                </td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{o.items.length}</td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)" }}>{formatMoney(Number(o.finalAmount))}</td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                    {o.deliveryType === "DELIVERY" ? <Truck size={13} /> : <Package size={13} />} {o.deliveryType}
                  </div>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, padding: "0.25rem 0.65rem", borderRadius: "999px", backgroundColor: ORDER_STATUS_STYLES[o.status]?.bg, color: ORDER_STATUS_STYLES[o.status]?.color }}>{o.status}</span>
                </td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                  {new Date(o.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    {STATUS_FLOW[o.status] && (
                      <button onClick={() => advance(o.id, o.status)} disabled={isPending} style={{ fontSize: "var(--text-xs)", padding: "0.25rem 0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-surface)", cursor: "pointer", color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>
                        → {STATUS_FLOW[o.status]}
                      </button>
                    )}
                    {["PENDING", "PAID", "PROCESSING"].includes(o.status) && (
                      <button onClick={() => cancel(o.id)} disabled={isPending} style={{ fontSize: "var(--text-xs)", padding: "0.25rem 0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-danger-subtle)", background: "var(--color-danger-subtle)", cursor: "pointer", color: "var(--color-danger)" }}>
                        Cancel
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
