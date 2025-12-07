"use client"

import { useEffect, useMemo, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CustomersList } from "@/components/customers/customers-list"
import { Button } from "@/components/ui/button"
import { Plus, Download, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

type Customer = {
  id: number
  name?: string
  email?: string
  phone?: string
  createdAt?: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/customers", { cache: "no-store" })
      const data = await res.json()
      setCustomers(data.customers || [])
    } catch (err) {
      console.error("Failed to load customers", err)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const filteredCount = useMemo(() => {
    if (!query.trim()) return customers.length
    const q = query.toLowerCase()
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q),
    ).length
  }, [customers, query])

  const handleAddCustomer = async () => {
    const name = window.prompt("Customer name?")
    if (!name || !name.trim()) return
    const email = window.prompt("Customer email? (optional)") || ""
    const phone = window.prompt("Customer phone? (optional)") || ""
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() }),
      })
      if (!res.ok) throw new Error("Failed to add customer")
      await loadCustomers()
    } catch (err) {
      console.error(err)
      alert("Could not add customer")
    }
  }

  const handleExport = () => {
    const link = document.createElement("a")
    link.href = "/api/customers?format=csv"
    link.download = "customers.csv"
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title="Customers" description="Manage customer relationships and history" />
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {loading ? "Loading customers..." : `${filteredCount} total customers`}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  className="pl-9 w-64"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button asChild>
                <Link href="/customers/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Customer
                </Link>
              </Button>
            </div>
          </div>

          <CustomersList customers={customers} query={query} />
        </div>
      </main>
    </div>
  )
}
