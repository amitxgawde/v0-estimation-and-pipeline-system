import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CustomersList } from "@/components/customers/customers-list"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"

export default function CustomersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title="Customers" description="Manage customer relationships and history" />
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">48 total customers</div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </div>
          </div>
          <CustomersList />
        </div>
      </main>
    </div>
  )
}
