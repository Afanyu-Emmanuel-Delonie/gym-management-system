"use client"

import { useState, useEffect, useTransition } from "react"
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react"
import { getGymServices, createGymService, updateGymService, deleteGymService } from "@/actions/content"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Toast from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"
import { formatMoney } from "@/lib/utils"

type Service = { id: string; name: string; description: string; price: any; isActive: boolean; order: number }

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => { getGymServices().then((data) => setServices(data as Service[])) }, [])

  const toggle = (id: string, current: boolean) => {
    startTransition(async () => {
      await updateGymService(id, { isActive: !current })
      setServices((prev) => prev.map((s) => s.id === id ? { ...s, isActive: !current } : s))
    })
  }

  const remove = (id: string) => {
    startTransition(async () => {
      try {
        await deleteGymService(id)
        setServices((prev) => prev.filter((s) => s.id !== id))
        showToast("Service removed", "warning")
      } catch (e: any) { showToast(e.message, "error") }
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = fd.get("name") as string
    const description = fd.get("description") as string
    const price = fd.get("price") ? Number(fd.get("price")) : undefined
    startTransition(async () => {
      try {
        if (editId) {
          await updateGymService(editId, { name, description, price })
          setServices((prev) => prev.map((s) => s.id === editId ? { ...s, name, description, price } : s))
          showToast("Service updated", "success")
        } else {
          await createGymService({ name, description, price })
          const fresh = await getGymServices()
          setServices(fresh as Service[])
          showToast("Service added", "success")
        }
        setShowForm(false); setEditId(null)
      } catch (e: any) { showToast(e.message, "error") }
    })
  }

  const editService = services.find((s) => s.id === editId)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>Gym Services</h2>
          <p style={{ margin: "2px 0 0", fontSize: "var(--text-sm)" }}>Manage services shown on the public site</p>
        </div>
        <Button size="sm" onClick={() => { setShowForm(true); setEditId(null) }}><Plus size={14} /> Add Service</Button>
      </div>

      {showForm && (
        <div className="card">
          <h3 style={{ margin: "0 0 1rem" }}>{editId ? "Edit Service" : "New Service"}</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Input name="name" label="Service Name" placeholder="Personal Training" required defaultValue={editService?.name} />
              <Input name="price" type="number" label="Price (RWF) — leave blank for 'on request'" placeholder="50000" defaultValue={editService?.price ? Number(editService.price) : undefined} />
              <div style={{ gridColumn: "1/-1" }}>
                <Input name="description" label="Description" placeholder="Describe this service..." required defaultValue={editService?.description} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <Button type="button" variant="outline" size="sm" onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</Button>
              <Button type="submit" size="sm" loading={isPending}>{editId ? "Update" : "Add Service"}</Button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {services.map((s) => (
          <div key={s.id} className="card" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem" }}>
            <GripVertical size={16} style={{ color: "var(--color-text-muted)", flexShrink: 0, cursor: "grab" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2px" }}>
                <span style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--color-text-primary)" }}>{s.name}</span>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: "999px", backgroundColor: s.isActive ? "var(--color-success-subtle)" : "var(--color-surface-raised)", color: s.isActive ? "var(--color-success)" : "var(--color-text-muted)" }}>
                  {s.isActive ? "Active" : "Hidden"}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{s.description}</p>
            </div>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-primary)", flexShrink: 0 }}>
              {s.price ? formatMoney(Number(s.price)) : "On request"}
            </span>
            <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
              <button onClick={() => toggle(s.id, s.isActive)} style={{ fontSize: "var(--text-xs)", padding: "0.25rem 0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-surface)", cursor: "pointer", color: "var(--color-text-secondary)" }}>
                {s.isActive ? "Hide" : "Show"}
              </button>
              <button onClick={() => { setEditId(s.id); setShowForm(true) }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex" }}><Pencil size={15} /></button>
              <button onClick={() => remove(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-danger)", display: "flex" }}><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
