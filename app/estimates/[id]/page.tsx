import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { EstimateDetail } from "@/components/estimates/estimate-detail"

export default function EstimateDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title={`Estimate ${params.id}`} description="View and manage estimate" />
        <div className="p-6">
          <EstimateDetail id={params.id} />
        </div>
      </main>
    </div>
  )
}
