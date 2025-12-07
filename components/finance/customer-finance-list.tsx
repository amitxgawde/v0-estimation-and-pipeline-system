"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight, AlertCircle } from "lucide-react"
import Link from "next/link"

const customers = [
  {
    id: "1",
    name: "Global Solutions",
    orders: 3,
    totalValue: 48000,
    collected: 36000,
    pending: 12000,
    overdue: 0,
    profit: 9600,
    status: "good",
  },
  {
    id: "2",
    name: "TechStart Inc",
    orders: 2,
    totalValue: 18500,
    collected: 9250,
    pending: 9250,
    overdue: 4500,
    profit: 5550,
    status: "overdue",
  },
  {
    id: "3",
    name: "BuildRight LLC",
    orders: 1,
    totalValue: 45800,
    collected: 22900,
    pending: 22900,
    overdue: 0,
    profit: 8244,
    status: "partial",
  },
  {
    id: "4",
    name: "Retail Plus",
    orders: 4,
    totalValue: 22400,
    collected: 22400,
    pending: 0,
    overdue: 0,
    profit: 7840,
    status: "paid",
  },
  {
    id: "5",
    name: "CoreTech Systems",
    orders: 2,
    totalValue: 34600,
    collected: 17300,
    pending: 17300,
    overdue: 3200,
    profit: 6920,
    status: "overdue",
  },
  {
    id: "6",
    name: "Metro Industries",
    orders: 1,
    totalValue: 15600,
    collected: 15600,
    pending: 0,
    overdue: 0,
    profit: 3432,
    status: "paid",
  },
]

const statusStyles: Record<string, { badge: string; text: string }> = {
  paid: { badge: "bg-success/10 text-success border-success/20", text: "Paid" },
  good: { badge: "bg-info/10 text-info border-info/20", text: "Good" },
  partial: { badge: "bg-warning/10 text-warning border-warning/20", text: "Partial" },
  overdue: { badge: "bg-destructive/10 text-destructive border-destructive/20", text: "Overdue" },
}

export function CustomerFinanceList() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Customers</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search customers..." className="pl-9" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Customer
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Orders
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Total Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Collection
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Profit
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map((customer) => {
                const collectionProgress = (customer.collected / customer.totalValue) * 100
                return (
                  <tr key={customer.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          href={`/customers/${customer.id}`}
                          className="text-sm font-medium text-foreground hover:text-primary"
                        >
                          {customer.name}
                        </Link>
                        {customer.overdue > 0 && (
                          <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                            <AlertCircle className="h-3 w-3" />${customer.overdue.toLocaleString()} overdue
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-foreground">{customer.orders}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                      ${customer.totalValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-success">${customer.collected.toLocaleString()}</span>
                          <span className="text-muted-foreground">{Math.round(collectionProgress)}%</span>
                        </div>
                        <Progress value={collectionProgress} className="h-1.5" />
                        {customer.pending > 0 && (
                          <p className="text-xs text-muted-foreground">${customer.pending.toLocaleString()} pending</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-success">
                      ${customer.profit.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className={statusStyles[customer.status].badge}>
                        {statusStyles[customer.status].text}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/customers/${customer.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
