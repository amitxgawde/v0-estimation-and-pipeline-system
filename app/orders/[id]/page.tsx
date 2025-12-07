import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { OrderDetail } from "@/components/orders/order-detail"

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title={`Order ${id}`} description="View and manage order" />
        <div className="p-6">
          <OrderDetail id={id} />
        </div>
      </main>
    </div>
  )
}
