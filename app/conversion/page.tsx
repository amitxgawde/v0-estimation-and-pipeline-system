import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ConversionAnalysisPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title="Conversion Analysis" description="Breakdown of estimate-to-order performance" />
        <div className="p-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="secondary">India (INR)</Badge>
                <Badge variant="outline">Customer-facing view</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Add more data by creating and submitting estimates. Conversion will update as orders are created.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Conversion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-bold text-foreground">0%</p>
              <p className="text-sm text-muted-foreground">No orders yet. Submit an estimate and convert it to see trends.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

