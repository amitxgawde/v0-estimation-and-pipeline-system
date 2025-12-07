import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"

const estimates = [
  {
    id: "EST-001",
    customer: "Acme Corp",
    amount: "$12,500",
    status: "sent",
    date: "2 hours ago",
  },
  {
    id: "EST-002",
    customer: "TechStart Inc",
    amount: "$8,750",
    status: "viewed",
    date: "5 hours ago",
  },
  {
    id: "EST-003",
    customer: "Global Solutions",
    amount: "$24,000",
    status: "accepted",
    date: "1 day ago",
  },
  {
    id: "EST-004",
    customer: "Retail Plus",
    amount: "$5,200",
    status: "negotiating",
    date: "2 days ago",
  },
]

const statusStyles: Record<string, string> = {
  sent: "bg-info/10 text-info border-info/20",
  viewed: "bg-warning/10 text-warning border-warning/20",
  accepted: "bg-success/10 text-success border-success/20",
  negotiating: "bg-secondary text-secondary-foreground",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
}

export function RecentEstimates() {
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
        <div className="divide-y divide-border">
          {estimates.map((estimate) => (
            <div key={estimate.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{estimate.customer}</p>
                  <p className="text-xs text-muted-foreground">{estimate.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{estimate.amount}</p>
                  <p className="text-xs text-muted-foreground">{estimate.date}</p>
                </div>
                <Badge variant="outline" className={statusStyles[estimate.status]}>
                  {estimate.status}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
