import { getSubscriptionStats } from "@/services/subscriptions"
import SubscriptionStats from "./components/SubscriptionStats"
import SubscriptionTable from "./components/SubscriptionTable"

export default async function AdminSubscriptions() {
  const stats = await getSubscriptionStats()
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <SubscriptionStats stats={stats} />
      <SubscriptionTable />
    </div>
  )
}
