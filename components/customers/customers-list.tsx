"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, ArrowRight } from "lucide-react"
import Link from "next/link"

type Customer = {
  id: number
  name?: string
  email?: string
  phone?: string
  createdAt?: string
}

interface CustomersListProps {
  customers: Customer[]
  query: string
  onSelect?: (customer: Customer) => void
}

export function CustomersList({ customers, query, onSelect }: CustomersListProps) {
  const filtered = query.trim()
    ? customers.filter((c) => {
        const q = query.toLowerCase()
        return (
          c.name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q)
        )
      })
    : customers

  return (
    <Card>
      <CardContent className="p-6">
        {filtered.length === 0 ? (
          <div className="text-sm text-muted-foreground">No customers yet.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((customer) => (
              <Card key={customer.id} className="hover:border-primary/50 transition-colors">
                <CardContent
                  className="p-4"
                  onClick={() => onSelect?.(customer)}
                  role={onSelect ? "button" : undefined}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link
                        href={`/customers/${customer.id}`}
                        className="text-sm font-medium text-foreground hover:text-primary"
                      >
                        {customer.name || "Unnamed"}
                      </Link>
                      <Badge variant="secondary" className="mt-1">
                        active
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
                      {customer.email || "—"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      {customer.phone || "—"}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-3">
                    Added on {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "—"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
