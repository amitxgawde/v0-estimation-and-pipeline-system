import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, AlertCircle } from "lucide-react"
import Link from "next/link"

const financeData = {
  outstanding: "$45,200",
  dueToday: "$8,500",
  overdue: "$12,300",
  collected: "$156,800",
}

const overdueCustomers = [
  { name: "TechStart Inc", amount: "$4,500", days: 15 },
  { name: "Retail Plus", amount: "$3,200", days: 8 },
  { name: "Global Solutions", amount: "$4,600", days: 5 },
]

export function FinanceSummary() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Finance Summary</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/finance" className="gap-1">
            View details <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-secondary p-3">
            <p className="text-xs text-muted-foreground">Outstanding</p>
            <p className="text-lg font-semibold text-foreground">{financeData.outstanding}</p>
          </div>
          <div className="rounded-lg bg-secondary p-3">
            <p className="text-xs text-muted-foreground">Due Today</p>
            <p className="text-lg font-semibold text-foreground">{financeData.dueToday}</p>
          </div>
          <div className="rounded-lg bg-destructive/10 p-3">
            <p className="text-xs text-destructive">Overdue</p>
            <p className="text-lg font-semibold text-destructive">{financeData.overdue}</p>
          </div>
          <div className="rounded-lg bg-success/10 p-3">
            <p className="text-xs text-success">Collected (MTD)</p>
            <p className="text-lg font-semibold text-success">{financeData.collected}</p>
          </div>
        </div>

        {/* Overdue List */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm font-medium text-foreground">Overdue Payments</p>
          </div>
          <div className="space-y-2">
            {overdueCustomers.map((customer) => (
              <div
                key={customer.name}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">{customer.days} days overdue</p>
                </div>
                <p className="text-sm font-semibold text-destructive">{customer.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
