import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"

type Estimate = {
  id: number
  status?: string
  customer?: { name?: string }
  totals?: { total?: number }
  createdAt?: string
}

const statusStyles: Record<string, string> = {
  draft: "bg-secondary text-secondary-foreground",
  submitted: "bg-info/10 text-info border-info/20",
  sent: "bg-info/10 text-info border-info/20",
  viewed: "bg-warning/10 text-warning border-warning/20",
  accepted: "bg-success/10 text-success border-success/20",
  negotiating: "bg-secondary text-secondary-foreground",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
}

export function RecentEstimates({ estimates }: { estimates: Estimate[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Recent Estimates</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/estimates" className="gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {estimates.length === 0 ? (
          <div className="px-6 py-8 text-sm text-muted-foreground">No estimates yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {estimates.map((estimate) => (
              <div key={estimate.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{estimate.customer?.name || "—"}</p>
                    <p className="text-xs text-muted-foreground">EST-{estimate.id.toString().padStart(4, "0")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {typeof estimate.totals?.total === "number"
                        ? estimate.totals.total.toLocaleString("en-IN", { style: "currency", currency: "INR" })
                        : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {estimate.createdAt ? new Date(estimate.createdAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={statusStyles[estimate.status || "draft"] || "bg-secondary text-secondary-foreground"}
                  >
                    {estimate.status || "draft"}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/estimates/${estimate.id}`}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
