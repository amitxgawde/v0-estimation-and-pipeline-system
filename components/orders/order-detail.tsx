"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Truck, CheckCircle, Package, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

type Order = {
  id: number
  status: string
  customer?: string
  estimateId?: string | number
  amount?: number
  items?: number
  progress?: number
  subStatus?: string
  paymentStatus?: string
  paymentReceived?: number
  confirmedDate?: string
  expectedDelivery?: string
}

const statusStyles: Record<string, { badge: string; icon: typeof Package }> = {
  sourcing: { badge: "bg-info/10 text-info border-info/20", icon: Clock },
  processing: { badge: "bg-warning/10 text-warning border-warning/20", icon: Package },
  ready: { badge: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  delivered: { badge: "bg-muted text-muted-foreground", icon: Truck },
}

export function OrderDetail({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" })
        const data = await res.json()
        const found = (data.orders || []).find((o: any) => String(o.id) === String(id))
        setOrder(found ?? null)
      } catch (err) {
        console.error("Failed to load order", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <p className="text-sm text-muted-foreground">Loading order...</p>
  if (!order) return <p className="text-sm text-muted-foreground">Order not found.</p>

  const StatusIcon = statusStyles[order.status]?.icon || Package

  return (
    <div className="space-y-4">
      <Button variant="ghost" asChild className="mb-2">
        <Link href="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </Button>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">ORD-{order.id.toString().padStart(3, "0")}</CardTitle>
            <p className="text-sm text-muted-foreground">{order.customer || "—"}</p>
          </div>
          <Badge variant="outline" className={statusStyles[order.status]?.badge || "bg-secondary text-secondary-foreground"}>
            {order.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <StatusIcon className="h-4 w-4" />
            <span>{order.subStatus || "No sub-status"}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Estimate</p>
              <p className="font-medium">{order.estimateId ?? "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Amount</p>
              <p className="font-medium">
                {typeof order.amount === "number"
                  ? order.amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })
                  : "—"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Items</p>
              <p className="font-medium">{order.items ?? 0}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Payment Received</p>
              <p className="font-medium">
                {typeof order.paymentReceived === "number"
                  ? order.paymentReceived.toLocaleString("en-IN", { style: "currency", currency: "INR" })
                  : "—"}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="text-foreground">{order.progress ?? 0}%</span>
            </div>
            <Progress value={order.progress ?? 0} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Confirmed</p>
              <p className="font-medium">{order.confirmedDate || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Expected Delivery</p>
              <p className="font-medium">{order.expectedDelivery || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
