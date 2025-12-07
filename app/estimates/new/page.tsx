import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { EstimateForm } from "@/components/estimates/estimate-form"

export default function NewEstimatePage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title="New Estimate" description="Create a new estimate for your customer" />
        <div className="p-6">
          <EstimateForm />
        </div>
      </main>
    </div>
  )
}
