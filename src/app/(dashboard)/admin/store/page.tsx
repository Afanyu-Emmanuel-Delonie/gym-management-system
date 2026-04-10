"use client"

import { useState } from "react"
import { Package, ShoppingBag, Tag } from "lucide-react"
import Products from "./components/Products"
import Orders from "./components/Orders"
import Discounts from "./components/Discounts"

const TABS = [
  { key: "products",  label: "Products",  icon: <Package size={15} /> },
  { key: "orders",    label: "Orders",    icon: <ShoppingBag size={15} /> },
  { key: "discounts", label: "Discounts", icon: <Tag size={15} /> },
]

export default function StorePage() {
  const [tab, setTab] = useState("products")

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
      {tab === "products"  && <Products />}
      {tab === "orders"    && <Orders />}
      {tab === "discounts" && <Discounts />}
    </div>
  )
}
