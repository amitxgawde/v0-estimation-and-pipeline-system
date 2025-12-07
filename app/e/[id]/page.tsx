import { CustomerEstimateView } from "@/components/estimates/customer-estimate-view"

export default function PublicEstimatePage({ params }: { params: { id: string } }) {
  return <CustomerEstimateView id={params.id} />
}
