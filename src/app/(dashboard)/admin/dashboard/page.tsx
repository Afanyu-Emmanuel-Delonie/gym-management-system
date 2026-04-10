import { CreditCard, Package } from "lucide-react"
import {
  getDashboardStats,
  getExpiringSoonSubscriptions,
  getSubscriptionDistribution,
  getProductDistribution,
  getRecentActivity,
  getMonthlyRevenue,
  getMonthlyMembers,
  getMonthlySubscriptions,
  getMonthlyOrders,
} from "@/services/dashboard"
import StatCards from "./components/StatCards"
import DonutChart from "./components/DonutChart"
import RevenueTrend from "./components/RevenueTrend"
import ExpiringSubscriptions from "./components/ExpiringSubscriptions"
import RecentActivity from "./components/RecentActivity"

const DONUT_COLORS = ["#c60b0b", "#6366f1", "#f59e0b", "#22c55e", "#0ea5e9", "#ec4899"]

export default async function AdminDashboard() {
  const [stats, expiring, subDist, prodDist, activity, revenue, members, subs, orders] = await Promise.all([
    getDashboardStats(),
    getExpiringSoonSubscriptions(),
    getSubscriptionDistribution(),
    getProductDistribution(),
    getRecentActivity(),
    getMonthlyRevenue(),
    getMonthlyMembers(),
    getMonthlySubscriptions(),
    getMonthlyOrders(),
  ])

  const subDonut  = subDist.map((d, i)  => ({ ...d, color: DONUT_COLORS[i % DONUT_COLORS.length] }))
  const prodDonut = prodDist.map((d, i) => ({ ...d, color: DONUT_COLORS[i % DONUT_COLORS.length] }))

  const trendData = { revenue, members, subscriptions: subs, orders }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <StatCards stats={stats} trendData={trendData} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <DonutChart title="Subscription Distribution" icon={<CreditCard size={16} />} data={subDonut} />
        <DonutChart title="Product Distribution"      icon={<Package size={16} />}    data={prodDonut} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <RevenueTrend trendData={trendData} />
        <ExpiringSubscriptions subscriptions={expiring} />
      </div>

      <RecentActivity activities={activity} />
    </div>
  )
}
