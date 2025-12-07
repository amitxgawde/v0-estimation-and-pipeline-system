import { CustomerEstimateView } from "@/components/estimates/customer-estimate-view"

export default async function PublicEstimatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CustomerEstimateView id={id} />
}
