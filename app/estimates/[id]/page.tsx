import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { EstimateDetail } from "@/components/estimates/estimate-detail"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EstimateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!id) {
    redirect("/estimates")
  }

  const displayId = `EST-${id.toString().padStart(4, "0")}`

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title={`Estimate ${displayId}`} description="View and manage estimate" />
        <div className="p-6">
          <EstimateDetail id={id} />
        </div>
      </main>
    </div>
  )
}
