import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp } from "lucide-react"

const payments = [
  { customer: "Global Solutions", amount: 12000, date: "Today", type: "partial", order: "ORD-001" },
  { customer: "Retail Plus", amount: 5600, date: "Yesterday", type: "final", order: "ORD-008" },
  { customer: "Metro Industries", amount: 7800, date: "2 days ago", type: "final", order: "ORD-009" },
  { customer: "BuildRight LLC", amount: 22900, date: "3 days ago", type: "advance", order: "ORD-002" },
  { customer: "TechStart Inc", amount: 4375, date: "4 days ago", type: "partial", order: "ORD-007" },
]

const typeStyles: Record<string, string> = {
  advance: "bg-info/10 text-info border-info/20",
  partial: "bg-warning/10 text-warning border-warning/20",
  final: "bg-success/10 text-success border-success/20",
}

export function PaymentHistory() {
  const totalRecent = payments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4" />
          Recent Payments
        </CardTitle>
        <p className="text-sm text-muted-foreground">${totalRecent.toLocaleString()} in last 5 days</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {payments.map((payment, index) => (
          <div key={index} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                <DollarSign className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{payment.customer}</p>
                <p className="text-xs text-muted-foreground">{payment.order}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={typeStyles[payment.type]}>
                    {payment.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{payment.date}</span>
                </div>
              </div>
            </div>
            <p className="text-sm font-bold text-success">${payment.amount.toLocaleString()}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
