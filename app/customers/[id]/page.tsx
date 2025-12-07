import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CustomerDetail } from "@/components/customers/customer-detail"

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title="Customer Details" description="View customer history and financials" />
        <div className="p-6">
          <CustomerDetail id={id} />
        </div>
      </main>
    </div>
  )
}
