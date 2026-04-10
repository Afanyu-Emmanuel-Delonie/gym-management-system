"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

interface DonutItem { name: string; value: number; color: string }

interface DonutChartProps {
  title: string
  icon: React.ReactNode
  data: DonutItem[]
}

export default function DonutChart({ title, icon, data }: DonutChartProps) {
  const total = data.reduce((a, b) => a + b.value, 0)

  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <span style={{ color: "var(--color-primary)" }}>{icon}</span>
        <h3 style={{ margin: 0 }}>{title}</h3>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <ResponsiveContainer width={130} height={130}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={3} dataKey="value">
              {data.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "6px" }} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {data.map((d) => (
            <div key={d.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>{d.name}</span>
                </div>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-primary)" }}>
                  {d.value} <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>({Math.round(d.value / total * 100)}%)</span>
                </span>
              </div>
              <div style={{ height: "3px", backgroundColor: "var(--color-surface-raised)", borderRadius: "999px" }}>
                <div style={{ height: "100%", width: `${Math.round(d.value / total * 100)}%`, backgroundColor: d.color, borderRadius: "999px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
