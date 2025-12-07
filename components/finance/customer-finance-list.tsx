"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight } from "lucide-react"
import Link from "next/link"

export function CustomerFinanceList() {
  const [orders, setOrders] = useState<any[]>([])
  const [query, setQuery] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const ord = await fetch("/api/orders", { cache: "no-store" }).then((r) => r.json())
        setOrders(ord.orders || [])
      } catch (err) {
        console.error("Finance customers load failed", err)
      }
    }
    load()
  }, [])

  const customers = useMemo(() => {
    const byCustomer = new Map<
      string,
      { name: string; orders: number; totalValue: number; collected: number; pending: number }
    >()
    orders.forEach((o) => {
      const key = o.customer || "Unknown"
      const curr = byCustomer.get(key) || { name: key, orders: 0, totalValue: 0, collected: 0, pending: 0 }
      curr.orders += 1
      curr.totalValue += o.amount || 0
      curr.collected += o.paymentReceived || 0
      curr.pending += Math.max((o.amount || 0) - (o.paymentReceived || 0), 0)
      byCustomer.set(key, curr)
    })
    const arr = Array.from(byCustomer.values())
    if (!query.trim()) return arr
    const q = query.toLowerCase()
    return arr.filter((c) => c.name.toLowerCase().includes(q))
  }, [orders, query])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Customers</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search customers..." className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map((customer, idx) => {
                const collectionProgress =
                  customer.totalValue > 0 ? Math.round((customer.collected / customer.totalValue) * 100) : 0
                return (
                  <tr key={idx} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          href={`/customers`}
                          className="text-sm font-medium text-foreground hover:text-primary"
                        >
                          {customer.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-foreground">{customer.orders}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                      {customer.totalValue.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-success">
                            {customer.collected.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                          </span>
                          <span className="text-muted-foreground">{collectionProgress}%</span>
                        </div>
                        <Progress value={collectionProgress} className="h-1.5" />
                        {customer.pending > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {customer.pending.toLocaleString("en-IN", { style: "currency", currency: "INR" })} pending
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/customers`}>
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
