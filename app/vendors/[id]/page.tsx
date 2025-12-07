import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { VendorDetail } from "@/components/vendors/vendor-detail"

export default async function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title={`Vendor ${id}`} description="View vendor details" />
        <div className="p-6">
          <VendorDetail id={id} />
        </div>
      </main>
    </div>
  )
}
