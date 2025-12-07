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
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  User,
  Calendar,
  ArrowRight,
  Phone,
  Mail,
} from "lucide-react"
import Link from "next/link"

interface OrderDetailProps {
  id: string
}

const order = {
  id: "ORD-001",
  customer: "Global Solutions",
  email: "orders@globalsolutions.com",
  phone: "+91 98765 43210",
  estimateId: "EST-003",
  status: "processing",
  subStatus: "Quality Check",
  progress: 65,
  amount: 24000,
  paymentReceived: 12000,
  confirmedDate: "Dec 4, 2025",
  expectedDelivery: "Dec 18, 2025",
  items: [
    { description: "Industrial Motor Unit", quantity: 5, price: 1875, status: "ready" },
    { description: "Installation Service", quantity: 1, price: 1120, status: "pending" },
    { description: "Annual Maintenance Contract", quantity: 1, price: 1560, status: "pending" },
  ],
  vendor: {
    name: "MotorTech Suppliers",
    contact: "Rahul Sharma",
    phone: "+91 98765 12345",
  },
  checklist: [
    { id: "1", task: "Confirm vendor availability", done: true },
    { id: "2", task: "Place order with vendor", done: true },
    { id: "3", task: "Receive goods", done: true },
    { id: "4", task: "Quality check", done: false },
    { id: "5", task: "Pack for delivery", done: false },
    { id: "6", task: "Schedule delivery", done: false },
    { id: "7", task: "Deliver to customer", done: false },
    { id: "8", task: "Collect final payment", done: false },
  ],
  timeline: [
    { date: "Dec 4, 2025", event: "Order confirmed", status: "done" },
    { date: "Dec 5, 2025", event: "Advance payment received", status: "done" },
    { date: "Dec 6, 2025", event: "Vendor order placed", status: "done" },
    { date: "Dec 10, 2025", event: "Goods received from vendor", status: "done" },
    { date: "Dec 12, 2025", event: "Quality check", status: "current" },
    { date: "Dec 15, 2025", event: "Ready for dispatch", status: "pending" },
    { date: "Dec 18, 2025", event: "Expected delivery", status: "pending" },
  ],
}

const statusSteps = [
  { id: "confirmed", label: "Confirmed", icon: CheckCircle },
  { id: "sourcing", label: "Sourcing", icon: Package },
  { id: "processing", label: "Processing", icon: Clock },
  { id: "ready", label: "Ready", icon: Package },
  { id: "delivered", label: "Delivered", icon: Truck },
]

export function OrderDetail({ id }: OrderDetailProps) {
  const [checklist, setChecklist] = useState(order.checklist)
  const currentStepIndex = 2 // Processing

  const toggleChecklistItem = (itemId: string) => {
    setChecklist(checklist.map((item) => (item.id === itemId ? { ...item, done: !item.done } : item)))
  }

  const pendingAmount = order.amount - order.paymentReceived

  return (
    <div className="space-y-6">
      {/* Status Steps */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => {
              const isCompleted = index < currentStepIndex
              const isCurrent = index === currentStepIndex
              return (
                <div key={step.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isCompleted
                          ? "bg-success text-success-foreground"
                          : isCurrent
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className={`mx-2 h-0.5 flex-1 ${isCompleted ? "bg-success" : "bg-border"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="items">
                <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
                  <TabsTrigger
                    value="items"
                    className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary"
                  >
                    Items
                  </TabsTrigger>
                  <TabsTrigger
                    value="checklist"
                    className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary"
                  >
                    Checklist
                  </TabsTrigger>
                  <TabsTrigger
                    value="timeline"
                    className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary"
                  >
                    Timeline
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="items" className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="pb-3 text-left text-xs font-medium uppercase text-muted-foreground">Item</th>
                          <th className="pb-3 text-center text-xs font-medium uppercase text-muted-foreground">Qty</th>
                          <th className="pb-3 text-right text-xs font-medium uppercase text-muted-foreground">Price</th>
                          <th className="pb-3 text-right text-xs font-medium uppercase text-muted-foreground">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {order.items.map((item, index) => (
                          <tr key={index}>
                            <td className="py-3 text-sm text-foreground">{item.description}</td>
                            <td className="py-3 text-center text-sm text-foreground">{item.quantity}</td>
                            <td className="py-3 text-right text-sm font-medium text-foreground">
                              {(item.price * item.quantity).toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                            </td>
                            <td className="py-3 text-right">
                              <Badge
                                variant="outline"
                                className={
                                  item.status === "ready"
                                    ? "bg-success/10 text-success border-success/20"
                                    : "bg-secondary text-secondary-foreground"
                                }
                              >
                                {item.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="checklist" className="p-6">
                  <div className="space-y-3">
                    {checklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox checked={item.done} onCheckedChange={() => toggleChecklistItem(item.id)} />
                        <span
                          className={`text-sm ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}
                        >
                          {item.task}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Progress
                      value={(checklist.filter((c) => c.done).length / checklist.length) * 100}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {checklist.filter((c) => c.done).length} of {checklist.length} tasks completed
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="p-6">
                  <div className="space-y-4">
                    {order.timeline.map((event, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full ${
                              event.status === "done"
                                ? "bg-success/20"
                                : event.status === "current"
                                  ? "bg-primary/20"
                                  : "bg-secondary"
                            }`}
                          >
                            <div
                              className={`h-2 w-2 rounded-full ${
                                event.status === "done"
                                  ? "bg-success"
                                  : event.status === "current"
                                    ? "bg-primary"
                                    : "bg-muted-foreground"
                              }`}
                            />
                          </div>
                          {index < order.timeline.length - 1 && <div className="h-full w-px bg-border" />}
                        </div>
                        <div className="pb-4">
                          <p
                            className={`text-sm font-medium ${event.status === "pending" ? "text-muted-foreground" : "text-foreground"}`}
                          >
                            {event.event}
                          </p>
                          <p className="text-xs text-muted-foreground">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-medium text-foreground">{order.customer}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {order.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {order.phone}
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Order Total</span>
                <span className="text-sm font-medium text-foreground">{order.amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-success">Received</span>
                <span className="text-sm font-medium text-success">{order.paymentReceived.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-sm font-medium text-foreground">Pending</span>
                <span className="text-sm font-bold text-destructive">{pendingAmount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</span>
              </div>
              <Button className="w-full">
                <DollarSign className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            </CardContent>
          </Card>

          {/* Vendor */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4" />
                Vendor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium text-foreground">{order.vendor.name}</p>
              <p className="text-sm text-muted-foreground">{order.vendor.contact}</p>
              <p className="text-sm text-muted-foreground">{order.vendor.phone}</p>
            </CardContent>
          </Card>

          {/* Related */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                Related
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full justify-between bg-transparent" asChild>
                <Link href={`/estimates/${order.estimateId}`}>
                  View Estimate {order.estimateId}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Confirmed</span>
                <span className="text-foreground">{order.confirmedDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Expected Delivery</span>
                <span className="text-foreground">{order.expectedDelivery}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
