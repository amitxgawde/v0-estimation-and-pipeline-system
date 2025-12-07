import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Mail, Phone, MapPin, Calendar, FileText, ShoppingCart, DollarSign, TrendingUp } from "lucide-react"
import Link from "next/link"

interface CustomerDetailProps {
  id: string
}

const customer = {
  name: "Global Solutions",
  email: "orders@globalsolutions.com",
  phone: "+91 98765 43210",
  address: "123 Business Park, Mumbai, MH 400001",
  since: "Jan 2024",
  totalOrders: 3,
  totalValue: 48000,
  collected: 36000,
  pending: 12000,
  overdue: 0,
  profit: 9600,
  orders: [
    {
      id: "ORD-001",
      estimateId: "EST-003",
      date: "Dec 4, 2025",
      amount: 24000,
      paid: 12000,
      status: "processing",
      profit: 4800,
    },
    {
      id: "ORD-015",
      estimateId: "EST-020",
      date: "Nov 20, 2025",
      amount: 16000,
      paid: 16000,
      status: "completed",
      profit: 3200,
    },
    {
      id: "ORD-008",
      estimateId: "EST-012",
      date: "Oct 15, 2025",
      amount: 8000,
      paid: 8000,
      status: "completed",
      profit: 1600,
    },
  ],
  estimates: [
    { id: "EST-003", date: "Dec 3, 2025", amount: 24000, status: "accepted" },
    { id: "EST-020", date: "Nov 18, 2025", amount: 16000, status: "accepted" },
    { id: "EST-012", date: "Oct 12, 2025", amount: 8000, status: "accepted" },
    { id: "EST-025", date: "Dec 5, 2025", amount: 32000, status: "sent" },
  ],
}

const statusStyles: Record<string, string> = {
  processing: "bg-warning/10 text-warning border-warning/20",
  completed: "bg-success/10 text-success border-success/20",
  sent: "bg-info/10 text-info border-info/20",
  accepted: "bg-success/10 text-success border-success/20",
}

export function CustomerDetail({ id }: CustomerDetailProps) {
  const collectionProgress = (customer.collected / customer.totalValue) * 100

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">{customer.name}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {customer.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {customer.address}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Customer since {customer.since}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-transparent">
                Edit Customer
              </Button>
              <Button>New Estimate</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <ShoppingCart className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{customer.totalOrders}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <DollarSign className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">${customer.totalValue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">${customer.collected.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Collected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">${customer.profit.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Your Profit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Payment Collection</span>
                <span className="text-sm font-medium text-foreground">{Math.round(collectionProgress)}%</span>
              </div>
              <Progress value={collectionProgress} className="h-2" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-secondary p-4">
                <p className="text-xs text-muted-foreground mb-1">Total Outstanding</p>
                <p className="text-xl font-bold text-foreground">${customer.pending.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-success/10 p-4">
                <p className="text-xs text-success mb-1">Collected</p>
                <p className="text-xl font-bold text-success">${customer.collected.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4">
                <p className="text-xs text-primary mb-1">Total Profit</p>
                <p className="text-xl font-bold text-primary">${customer.profit.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Orders</CardTitle>
            <Badge variant="secondary">{customer.orders.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer.orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <Link href={`/orders/${order.id}`} className="text-sm font-medium text-foreground hover:text-primary">
                    {order.id}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={statusStyles[order.status]}>
                      {order.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ${order.paid.toLocaleString()} / ${order.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">${order.amount.toLocaleString()}</p>
                  <p className="text-xs text-success mt-1">+${order.profit.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Estimates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Estimates</CardTitle>
            <Badge variant="secondary">{customer.estimates.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer.estimates.map((estimate) => (
              <div key={estimate.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Link
                      href={`/estimates/${estimate.id}`}
                      className="text-sm font-medium text-foreground hover:text-primary"
                    >
                      {estimate.id}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">{estimate.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">${estimate.amount.toLocaleString()}</p>
                  <Badge variant="outline" className={`${statusStyles[estimate.status]} mt-1`}>
                    {estimate.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
