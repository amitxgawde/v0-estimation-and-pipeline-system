"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, TrendingUp, AlertCircle, Calendar } from "lucide-react"

type Order = {
  amount?: number
  paymentReceived?: number
}

export function FinanceOverview() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const ord = await fetch("/api/orders", { cache: "no-store" }).then((r) => r.json())
        setOrders(ord.orders || [])
      } catch (err) {
        console.error("Finance overview load failed", err)
      }
    }
    load()
  }, [])

  const stats = useMemo(() => {
    const collected = orders.reduce((sum, o) => sum + (o.paymentReceived || 0), 0)
    const outstanding = orders.reduce(
      (sum, o) => sum + Math.max((o.amount || 0) - (o.paymentReceived || 0), 0),
      0,
    )
    return [
      {
        title: "Total Outstanding",
        value: outstanding.toLocaleString("en-IN", { style: "currency", currency: "INR" }),
        description: "Across customers",
        icon: DollarSign,
        color: "text-foreground",
      },
      {
        title: "Due Today",
        value: (0).toLocaleString("en-IN", { style: "currency", currency: "INR" }),
        description: "Payments expected",
        icon: Calendar,
        color: "text-warning",
      },
      {
        title: "Overdue",
        value: (0).toLocaleString("en-IN", { style: "currency", currency: "INR" }),
        description: "No overdue tracked",
        icon: AlertCircle,
        color: "text-destructive",
      },
      {
        title: "Collected (MTD)",
        value: collected.toLocaleString("en-IN", { style: "currency", currency: "INR" }),
        description: "Total received",
        icon: TrendingUp,
        color: "text-success",
      },
    ]
  }, [orders])

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
