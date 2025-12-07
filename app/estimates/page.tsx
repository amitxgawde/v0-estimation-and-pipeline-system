import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { EstimatesList } from "@/components/estimates/estimates-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default function EstimatesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title="Estimates" description="Create and manage your estimates" />
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                All
              </Button>
              <Button variant="ghost" size="sm">
                Sent
              </Button>
              <Button variant="ghost" size="sm">
                Accepted
              </Button>
              <Button variant="ghost" size="sm">
                Rejected
              </Button>
            </div>
            <Button asChild>
              <Link href="/estimates/new">
                <Plus className="mr-2 h-4 w-4" />
                New Estimate
              </Link>
            </Button>
          </div>
          <EstimatesList />
        </div>
      </main>
    </div>
  )
}
