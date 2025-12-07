import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CustomerDetail } from "@/components/customers/customer-detail"

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title="Customer Details" description="View customer history and financials" />
        <div className="p-6">
          <CustomerDetail id={params.id} />
        </div>
      </main>
    </div>
  )
}
