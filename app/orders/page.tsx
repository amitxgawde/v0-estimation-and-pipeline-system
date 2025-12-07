import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { OrdersList } from "@/components/orders/orders-list"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title="Orders" description="Manage confirmed orders and track execution" />
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                All
              </Button>
              <Button variant="ghost" size="sm">
                Sourcing
              </Button>
              <Button variant="ghost" size="sm">
                Processing
              </Button>
              <Button variant="ghost" size="sm">
                Ready
              </Button>
              <Button variant="ghost" size="sm">
                Delivered
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          <OrdersList />
        </div>
      </main>
    </div>
  )
}
