"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import Link from "next/link"

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{
    customers: any[]
    vendors: any[]
    estimates: any[]
    orders: any[]
  }>({ customers: [], vendors: [], estimates: [], orders: [] })

  useEffect(() => {
    const run = async () => {
      if (!query.trim()) {
        setResults({ customers: [], vendors: [], estimates: [], orders: [] })
        return
      }
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { cache: "no-store" })
        const data = await res.json()
        setResults(data)
      } catch (err) {
        console.error("Search failed", err)
        setResults({ customers: [], vendors: [], estimates: [], orders: [] })
      }
    }
    const t = setTimeout(run, 250)
    return () => clearTimeout(t)
  }, [query])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers, vendors, orders..."
            className="w-64 pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query.trim() && (
            <div className="absolute left-0 top-10 z-40 w-72 rounded-md border border-border bg-popover shadow-md">
              <div className="p-2">
                {results.customers?.length ? (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-muted-foreground">Customers</p>
                    {results.customers.map((c: any) => (
                      <Link
                        key={`c-${c.id}`}
                        className="block rounded px-2 py-1 text-sm hover:bg-muted"
                        href={`/customers/${c.id}`}
                      >
                        {c.name || "Unnamed"} {c.email ? `· ${c.email}` : ""}
                      </Link>
                    ))}
                  </div>
                ) : null}

                {results.vendors?.length ? (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-muted-foreground">Vendors</p>
                    {results.vendors.map((v: any) => (
                      <Link
                        key={`v-${v.id || v.name}`}
                        className="block rounded px-2 py-1 text-sm hover:bg-muted"
                        href={`/vendors/${v.id}`}
                      >
                        {v.name}
                      </Link>
                    ))}
                  </div>
                ) : null}

                {results.orders?.length ? (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-muted-foreground">Orders</p>
                    {results.orders.map((o: any) => (
                      <Link
                        key={`o-${o.id}`}
                        className="block rounded px-2 py-1 text-sm hover:bg-muted"
                        href={`/orders/${o.id}`}
                      >
                        Order {o.id} {o.customer ? `· ${o.customer}` : ""}
                      </Link>
                    ))}
                  </div>
                ) : null}

                {results.estimates?.length ? (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-muted-foreground">Estimates</p>
                    {results.estimates.map((e: any) => (
                      <Link
                        key={`e-${e.id}`}
                        className="block rounded px-2 py-1 text-sm hover:bg-muted"
                        href={`/estimates/${e.id}`}
                      >
                        Estimate {e.id} {e.customer?.name ? `· ${e.customer.name}` : ""}
                      </Link>
                    ))}
                  </div>
                ) : null}

                {!results.customers?.length &&
                  !results.vendors?.length &&
                  !results.orders?.length &&
                  !results.estimates?.length && (
                    <p className="px-2 py-1 text-xs text-muted-foreground">No matches.</p>
                  )}
              </div>
            </div>
          )}
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <Button variant="outline" size="sm" asChild>
          <Link href="/logout">Logout</Link>
        </Button>

        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
            <span className="sr-only">User avatar</span>
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
