"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Mail, Phone, ArrowRight } from "lucide-react"
import Link from "next/link"

const customers = [
  {
    id: "1",
    name: "Global Solutions",
    email: "orders@globalsolutions.com",
    phone: "+91 98765 43210",
    totalOrders: 3,
    totalValue: "$48,000",
    status: "active",
    lastOrder: "2 days ago",
  },
  {
    id: "2",
    name: "TechStart Inc",
    email: "jane@techstart.io",
    phone: "+91 98765 43211",
    totalOrders: 2,
    totalValue: "$18,500",
    status: "active",
    lastOrder: "1 week ago",
  },
  {
    id: "3",
    name: "BuildRight LLC",
    email: "procurement@buildright.com",
    phone: "+91 98765 43212",
    totalOrders: 1,
    totalValue: "$45,800",
    status: "active",
    lastOrder: "3 days ago",
  },
  {
    id: "4",
    name: "Retail Plus",
    email: "mike@retailplus.co",
    phone: "+91 98765 43213",
    totalOrders: 4,
    totalValue: "$22,400",
    status: "active",
    lastOrder: "1 day ago",
  },
  {
    id: "5",
    name: "CoreTech Systems",
    email: "ops@coretech.io",
    phone: "+91 98765 43214",
    totalOrders: 2,
    totalValue: "$34,600",
    status: "active",
    lastOrder: "5 days ago",
  },
  {
    id: "6",
    name: "Metro Industries",
    email: "procurement@metro.com",
    phone: "+91 98765 43215",
    totalOrders: 1,
    totalValue: "$15,600",
    status: "active",
    lastOrder: "1 week ago",
  },
]

export function CustomersList() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-9" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <Card key={customer.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Link
                      href={`/customers/${customer.id}`}
                      className="text-sm font-medium text-foreground hover:text-primary"
                    >
                      {customer.name}
                    </Link>
                    <Badge variant="secondary" className="mt-1">
                      {customer.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/customers/${customer.id}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {customer.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    {customer.phone}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Business</p>
                    <p className="text-sm font-semibold text-foreground">{customer.totalValue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <p className="text-sm font-semibold text-foreground">{customer.totalOrders}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-3">Last order: {customer.lastOrder}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
