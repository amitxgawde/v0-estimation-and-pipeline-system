"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp } from "lucide-react"

type Order = {
  customer?: string
  paymentReceived?: number
  createdAt?: string
  id?: number
}

const typeStyles: Record<string, string> = {
  advance: "bg-info/10 text-info border-info/20",
  partial: "bg-warning/10 text-warning border-warning/20",
  final: "bg-success/10 text-success border-success/20",
}

export function PaymentHistory() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const ord = await fetch("/api/orders", { cache: "no-store" }).then((r) => r.json())
        setOrders(ord.orders || [])
      } catch (err) {
        console.error("Payment history load failed", err)
      }
    }
    load()
  }, [])

  const recent = useMemo(() => {
    return orders
      .filter((o) => (o.paymentReceived || 0) > 0)
      .sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
      )
      .slice(0, 5)
  }, [orders])

  const totalRecent = recent.reduce((sum, p) => sum + (p.paymentReceived || 0), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4" />
          Recent Payments
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {totalRecent.toLocaleString("en-IN", { style: "currency", currency: "INR" })} received
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {recent.length === 0 && <p className="text-sm text-muted-foreground">No payments recorded.</p>}
        {recent.map((payment, index) => (
          <div key={index} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                <DollarSign className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{payment.customer || "—"}</p>
                <p className="text-xs text-muted-foreground">ORD-{payment.id?.toString().padStart(3, "0")}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={typeStyles["final"]}>
                    received
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "—"}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm font-bold text-success">
              {payment.paymentReceived?.toLocaleString("en-IN", { style: "currency", currency: "INR" }) || "—"}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
