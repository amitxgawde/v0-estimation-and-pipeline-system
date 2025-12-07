import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { OrderDetail } from "@/components/orders/order-detail"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title={`Order ${params.id}`} description="Order details and execution tracking" />
        <div className="p-6">
          <OrderDetail id={params.id} />
        </div>
      </main>
    </div>
  )
}
