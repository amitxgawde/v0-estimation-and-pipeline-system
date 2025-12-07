import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { FinanceOverview } from "@/components/finance/finance-overview"
import { CustomerFinanceList } from "@/components/finance/customer-finance-list"
import { PaymentHistory } from "@/components/finance/payment-history"

export default function FinancePage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title="Finance" description="Track payments, outstanding amounts, and profitability" />
        <div className="p-6">
          <div className="space-y-6">
            <FinanceOverview />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <CustomerFinanceList />
              </div>
              <div>
                <PaymentHistory />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
