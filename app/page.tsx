import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatsCard } from "@/components/stats-card"
import { RecentEstimates } from "@/components/dashboard/recent-estimates"
import { PipelinePreview } from "@/components/dashboard/pipeline-preview"
import { FinanceSummary } from "@/components/dashboard/finance-summary"
import { FileText, IndianRupee, ShoppingCart, TrendingUp } from "lucide-react"
import { listEstimates, listOrders, listPipeline } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const [estimates, orders, pipeline] = await Promise.all([listEstimates(), listOrders(), listPipeline()])

  const stats = {
    estimates: estimates.length,
    orders: orders.length,
    revenue: orders.reduce((sum, o) => sum + (o.amount || 0), 0),
    conversion:
      estimates.length > 0
        ? Math.round(((estimates.filter((e) => e.status === "accepted").length || 0) / estimates.length) * 100)
        : 0,
  }

  const recent = estimates.slice(-3).reverse()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title="Dashboard" description="Overview of your business" />
        <div className="p-6">
          {/* Stats Grid */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Active Estimates"
              value={stats.estimates.toString()}
              change={stats.estimates === 0 ? "No data yet" : `${stats.estimates} total`}
              changeType={stats.estimates === 0 ? "neutral" : "positive"}
              icon={FileText}
              href="/estimates"
            />
            <StatsCard
              title="Orders in Progress"
              value={stats.orders.toString()}
              change={stats.orders === 0 ? "No orders yet" : `${stats.orders} total`}
              changeType={stats.orders === 0 ? "neutral" : "positive"}
              icon={ShoppingCart}
              href="/orders"
            />
            <StatsCard
              title="Revenue (MTD)"
              value={stats.revenue.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
              change="Add estimates to track"
              changeType={stats.revenue === 0 ? "neutral" : "positive"}
              icon={IndianRupee}
              href="/finance"
            />
            <StatsCard
              title="Conversion Rate"
              value={`${stats.conversion}%`}
              change="Tap to view analysis"
              changeType="neutral"
              icon={TrendingUp}
              href="/conversion"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <RecentEstimates estimates={recent} />
              <PipelinePreview />
            </div>
            <div>
              <FinanceSummary />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
