import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, TrendingUp, AlertCircle, Calendar } from "lucide-react"

const stats = [
  {
    title: "Total Outstanding",
    value: "$45,200",
    description: "Across 12 customers",
    icon: DollarSign,
    color: "text-foreground",
  },
  {
    title: "Due Today",
    value: "$8,500",
    description: "3 payments expected",
    icon: Calendar,
    color: "text-warning",
  },
  {
    title: "Overdue",
    value: "$12,300",
    description: "5 payments overdue",
    icon: AlertCircle,
    color: "text-destructive",
  },
  {
    title: "Collected (MTD)",
    value: "$156,800",
    description: "+18% vs last month",
    icon: TrendingUp,
    color: "text-success",
  },
]

export function FinanceOverview() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
