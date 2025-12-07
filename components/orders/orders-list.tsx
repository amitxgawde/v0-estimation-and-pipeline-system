"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Truck, CheckCircle, Package, Clock } from "lucide-react"
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

const paymentStyles: Record<string, string> = {
  advance: "text-info",
  partial: "text-warning",
  pending: "text-destructive",
  paid: "text-success",
}

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" })
        const data = await res.json()
        setOrders(data.orders || [])
      } catch (err) {
        console.error("Failed to load orders", err)
        setOrders([])
      }
    }
    load()
  }, [])

  return (
    <div className="grid gap-4">
      {orders.map((order) => {
        const StatusIcon = statusStyles[order.status]?.icon || Package
        return (
          <Card key={order.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Order Info */}
                <div className="flex items-start gap-4 lg:w-1/3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <StatusIcon className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-sm font-medium text-foreground hover:text-primary"
                      >
                        ORD-{order.id.toString().padStart(3, "0")}
                      </Link>
                      <Badge variant="outline" className={statusStyles[order.status]?.badge}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">{order.customer || "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.items ?? 0} items from {order.estimateId ?? "—"}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="lg:w-1/4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{order.subStatus || "—"}</span>
                    <span className="text-xs font-medium text-foreground">{order.progress ?? 0}%</span>
                  </div>
                  <Progress value={order.progress ?? 0} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Expected: {order.expectedDelivery || "—"}</p>
                </div>

                {/* Payment */}
                <div className="lg:w-1/5">
                  <p className="text-sm font-semibold text-foreground">
                    {typeof order.amount === "number"
                      ? order.amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })
                      : "—"}
                  </p>
                  <p className={`text-xs ${paymentStyles[order.paymentStatus || ""] || ""}`}>
                    {typeof order.paymentReceived === "number"
                      ? `${order.paymentReceived.toLocaleString("en-IN", { style: "currency", currency: "INR" })} received`
                      : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{order.paymentStatus || "—"}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent" asChild>
                    <Link href={`/orders/${order.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Update Status</DropdownMenuItem>
                      <DropdownMenuItem>Record Payment</DropdownMenuItem>
                      <DropdownMenuItem>Send Update to Customer</DropdownMenuItem>
                      <DropdownMenuItem>View Estimate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
