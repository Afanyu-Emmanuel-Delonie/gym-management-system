"use client"

import { useState, useEffect, useTransition } from "react"
import { Plus, Pencil, Trash2, Package, AlertTriangle, X, ImagePlus, Eye } from "lucide-react"
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/actions/store"
import Pagination from "@/components/ui/Pagination"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Toast from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"
import { formatMoney } from "@/lib/utils"

const PAGE_SIZE = 10

type Product = { id: string; name: string; description: string | null; price: any; stock: number; category: string; image: string | null; isActive: boolean }

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "#00000060", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
      <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-lg)", width: "100%", maxWidth: "520px", overflow: "hidden", boxShadow: "var(--shadow-lg)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ height: "200px", backgroundColor: "var(--color-surface-raised)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          {product.image ? <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Package size={48} style={{ color: "var(--color-text-muted)" }} />}
          <button onClick={onClose} style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "#00000060", border: "none", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}><X size={14} /></button>
        </div>
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
            <h2 style={{ margin: 0 }}>{product.name}</h2>
            <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, padding: "0.25rem 0.65rem", borderRadius: "999px", backgroundColor: product.isActive ? "var(--color-success-subtle)" : "var(--color-surface-raised)", color: product.isActive ? "var(--color-success)" : "var(--color-text-muted)", flexShrink: 0 }}>
              {product.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <p style={{ margin: "0 0 1rem", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{product.category}</p>
          <p style={{ margin: "0 0 1.25rem", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{product.description}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ padding: "0.75rem", backgroundColor: "var(--color-surface-raised)", borderRadius: "var(--radius-md)" }}>
              <p style={{ margin: "0 0 2px", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Price</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "var(--text-lg)", color: "var(--color-primary)", fontFamily: "var(--font-title)" }}>{formatMoney(Number(product.price))}</p>
            </div>
            <div style={{ padding: "0.75rem", backgroundColor: product.stock === 0 ? "var(--color-danger-subtle)" : product.stock <= 5 ? "var(--color-warning-subtle)" : "var(--color-surface-raised)", borderRadius: "var(--radius-md)" }}>
              <p style={{ margin: "0 0 2px", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Stock</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "var(--text-lg)", color: product.stock === 0 ? "var(--color-danger)" : product.stock <= 5 ? "var(--color-warning)" : "var(--color-text-primary)", fontFamily: "var(--font-title)" }}>{product.stock} units</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductForm({ onClose, onSave, editProduct }: { onClose: () => void; onSave: () => void; editProduct?: Product }) {
  const [isPending, start] = useTransition()
  const [imagePreview, setImagePreview] = useState<string | null>(editProduct?.image ?? null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    start(async () => {
      const data = { name: fd.get("name") as string, description: fd.get("description") as string, price: Number(fd.get("price")), stock: Number(fd.get("stock")), category: fd.get("category") as string }
      if (editProduct) await updateProduct(editProduct.id, data)
      else await createProduct(data)
      onSave()
    })
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h3 style={{ margin: 0 }}>{editProduct ? "Edit Product" : "New Product"}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem", alignItems: "start" }}>
          <label style={{ cursor: "pointer" }}>
            <div style={{ height: "140px", border: "2px dashed var(--color-border)", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem", overflow: "hidden", backgroundColor: "var(--color-surface-raised)" }}>
              {imagePreview ? <img src={imagePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <><ImagePlus size={24} style={{ color: "var(--color-text-muted)" }} /><span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Upload image</span></>}
            </div>
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setImagePreview(URL.createObjectURL(f)) }} style={{ display: "none" }} />
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <Input name="name" label="Product Name" placeholder="Whey Protein 1kg" defaultValue={editProduct?.name} required />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>Category</label>
                <select name="category" className="input" defaultValue={editProduct?.category}>
                  {["Supplements", "Apparel", "Equipment", "Accessories"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <Input name="price" type="number" label="Price (RWF)" placeholder="45000" defaultValue={editProduct ? Number(editProduct.price) : undefined} required />
              <Input name="stock" type="number" label="Stock" placeholder="10" defaultValue={editProduct?.stock} required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>Description</label>
              <textarea name="description" className="input" rows={3} placeholder="Describe this product..." defaultValue={editProduct?.description ?? ""} style={{ resize: "vertical" }} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" loading={isPending}>{editProduct ? "Update" : "Add Product"}</Button>
        </div>
      </form>
    </div>
  )
}

export default function Products() {
  const [products, setProducts]   = useState<Product[]>([])
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [showForm, setShowForm]   = useState(false)
  const [editProduct, setEdit]    = useState<Product | undefined>()
  const [viewProduct, setView]    = useState<Product | null>(null)
  const [isPending, start]        = useTransition()
  const { toast, showToast, hideToast } = useToast()

  const load = (p: number) => {
    start(async () => {
      const res = await getProducts(undefined, p, PAGE_SIZE)
      setProducts(res.data as Product[])
      setTotal(res.total)
    })
  }

  useEffect(() => { load(page) }, [page])

  const handleDelete = (id: string) => {
    start(async () => {
      try { await deleteProduct(id); showToast("Product removed", "warning"); load(page) }
      catch (e: any) { showToast(e.message, "error") }
    })
  }

  const handleToggle = (id: string, current: boolean) => {
    start(async () => { await updateProduct(id, { isActive: !current }); load(page) })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      {viewProduct && <ProductModal product={viewProduct} onClose={() => setView(null)} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>Products</h2>
          <p style={{ margin: "2px 0 0", fontSize: "var(--text-sm)" }}>{total} total</p>
        </div>
        <Button size="sm" onClick={() => { setEdit(undefined); setShowForm(true) }}><Plus size={14} /> Add Product</Button>
      </div>

      {showForm && (
        <ProductForm
          editProduct={editProduct}
          onClose={() => { setShowForm(false); setEdit(undefined) }}
          onSave={() => { setShowForm(false); setEdit(undefined); showToast(editProduct ? "Product updated" : "Product added", "success"); load(page) }}
        />
      )}

      <div className="card" style={{ padding: 0, overflow: "hidden", opacity: isPending ? 0.6 : 1, transition: "opacity 0.2s" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface-raised)" }}>
              {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderTop: "1px solid var(--color-border)", transition: "background 0.1s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-raised)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-surface-raised)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Package size={16} style={{ color: "var(--color-text-muted)" }} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 500, fontSize: "var(--text-sm)", color: "var(--color-text-primary)" }}>{p.name}</p>
                      <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>{p.description}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{p.category}</td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)" }}>{formatMoney(Number(p.price))}</td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    {p.stock <= 5 && <AlertTriangle size={13} style={{ color: p.stock === 0 ? "var(--color-danger)" : "var(--color-warning)" }} />}
                    <span style={{ fontSize: "var(--text-sm)", color: p.stock === 0 ? "var(--color-danger)" : p.stock <= 5 ? "var(--color-warning)" : "var(--color-text-primary)", fontWeight: p.stock <= 5 ? 600 : 400 }}>{p.stock}</span>
                  </div>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <button onClick={() => handleToggle(p.id, p.isActive)} style={{ fontSize: "var(--text-xs)", fontWeight: 600, padding: "0.25rem 0.65rem", borderRadius: "999px", border: "none", cursor: "pointer", backgroundColor: p.isActive ? "var(--color-success-subtle)" : "var(--color-surface-raised)", color: p.isActive ? "var(--color-success)" : "var(--color-text-muted)" }}>
                    {p.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => setView(p)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)", display: "flex", padding: "0.2rem" }}><Eye size={15} /></button>
                    <button onClick={() => { setEdit(p); setShowForm(true) }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex", padding: "0.2rem" }}><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(p.id)} disabled={isPending} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-danger)", display: "flex", padding: "0.2rem" }}><Trash2 size={15} /></button>
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
