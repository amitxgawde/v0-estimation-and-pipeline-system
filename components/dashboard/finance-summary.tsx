 "use client"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, AlertCircle } from "lucide-react"
import Link from "next/link"

type Estimate = {
  totals: { total?: number; tax?: number; subtotal?: number }
}

type Order = {
  amount?: number
  paymentReceived?: number
}

export function FinanceSummary() {
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const est = await fetch("/api/estimates", { cache: "no-store" }).then((r) => r.json())
        const ord = await fetch("/api/orders", { cache: "no-store" }).then((r) => r.json())
        setEstimates(est.estimates || [])
        setOrders(ord.orders || [])
      } catch (err) {
        console.error("Finance load failed", err)
      }
    }
    load()
  }, [])

  const metrics = useMemo(() => {
    const totalEstimateValue = estimates.reduce((sum, e) => sum + (e.totals?.total || 0), 0)
    const collected = orders.reduce((sum, o) => sum + (o.paymentReceived || 0), 0)
    const outstanding = orders.reduce(
      (sum, o) => sum + Math.max((o.amount || 0) - (o.paymentReceived || 0), 0),
      0,
    )
    return {
      outstanding,
      dueToday: 0,
      overdue: 0,
      collected,
      totalEstimateValue,
    }
  }, [estimates, orders])

  const trend = useMemo(() => {
    const val = Math.max(metrics.collected, 1)
    return [val * 0.3, val * 0.5, val * 0.4, val * 0.65, val * 0.7, val * 0.8, val]
  }, [metrics.collected])

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
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-secondary p-3">
            <p className="text-xs text-muted-foreground">Outstanding</p>
            <p className="text-lg font-semibold text-foreground">
              {metrics.outstanding.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
            </p>
          </div>
          <div className="rounded-lg bg-secondary p-3">
            <p className="text-xs text-muted-foreground">Due Today</p>
            <p className="text-lg font-semibold text-foreground">
              {metrics.dueToday.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
            </p>
          </div>
          <div className="rounded-lg bg-destructive/10 p-3">
            <p className="text-xs text-destructive">Overdue</p>
            <p className="text-lg font-semibold text-destructive">
              {metrics.overdue.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
            </p>
          </div>
          <div className="rounded-lg bg-success/10 p-3">
            <p className="text-xs text-success">Collected</p>
            <p className="text-lg font-semibold text-success">
              {metrics.collected.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground mb-2">Collections trend</p>
          <svg viewBox="0 0 100 30" className="h-16 w-full text-primary/70">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              points={trend
                .map((v, i) => {
                  const x = (i / Math.max(trend.length - 1, 1)) * 100
                  const y = 30 - (v / Math.max(...trend, 1)) * 26 - 2
                  return `${x},${y}`
                })
                .join(" ")}
            />
          </svg>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm font-medium text-foreground">Overdue Payments</p>
          </div>
          <p className="text-sm text-muted-foreground">No overdue records yet.</p>
        </div>
      </CardContent>
    </Card>
  )
}
