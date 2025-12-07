import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatsCard } from "@/components/stats-card"
import { RecentEstimates } from "@/components/dashboard/recent-estimates"
import { PipelinePreview } from "@/components/dashboard/pipeline-preview"
import { FinanceSummary } from "@/components/dashboard/finance-summary"
import { FileText, DollarSign, ShoppingCart, TrendingUp } from "lucide-react"

export default function DashboardPage() {
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
              value="24"
              change="+3 from last week"
              changeType="positive"
              icon={FileText}
            />
            <StatsCard
              title="Orders in Progress"
              value="12"
              change="2 completing today"
              changeType="neutral"
              icon={ShoppingCart}
            />
            <StatsCard
              title="Revenue (MTD)"
              value="$48,250"
              change="+12.5% vs last month"
              changeType="positive"
              icon={DollarSign}
            />
            <StatsCard
              title="Conversion Rate"
              value="68%"
              change="+5% improvement"
              changeType="positive"
              icon={TrendingUp}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <RecentEstimates />
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
