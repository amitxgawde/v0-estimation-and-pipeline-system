"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { cn } from "@/lib/utils"

type EstimateRow = {
  id: number
  status: string
  customer?: { name?: string; email?: string }
  items?: Array<{
    id?: number
    description?: string
    quantity: number
    sellingPrice: number
    costPrice: number
  }>
  totals?: { total?: number; totalCost?: number }
  total?: number
  totalCost?: number
  createdAt?: string
}

const statusStyles: Record<string, string> = {
  draft: "bg-secondary text-secondary-foreground",
  submitted: "bg-info/10 text-info border-info/20",
  sent: "bg-info/10 text-info border-info/20",
  viewed: "bg-warning/10 text-warning border-warning/20",
  accepted: "bg-success/10 text-success border-success/20",
  negotiating: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
}

const formatCurrency = (value?: number) => {
  if (typeof value !== "number") return "—"
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value)
}

export function EstimatesList() {
  const [estimates, setEstimates] = useState<EstimateRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/estimates", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load estimates")
        const data = await res.json()
        setEstimates(data.estimates || [])
      } catch (err) {
        console.error("Failed to load estimates", err)
        setError("Could not load estimates. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDelete = async (id: number) => {
    const previous = estimates
    // optimistic remove
    setEstimates((prev) => prev.filter((e) => e.id !== id))
    try {
      const res = await fetch(`/api/estimates/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      const refreshed = await fetch("/api/estimates", { cache: "no-store" })
      if (!refreshed.ok) throw new Error("Refresh failed")
      const data = await refreshed.json()
      setEstimates(data.estimates || [])
    } catch (err) {
      console.error("Failed to delete estimate", err)
      alert("Delete failed")
      setEstimates(previous) // rollback
    }
  }

  const handleRevise = (id: number) => {
    router.push(`/estimates/${id}`)
  }

  const rows = useMemo(() => {
    return estimates.map((estimate) => {
      const customerName = (estimate as any).customer?.name ?? estimate.customer?.name ?? estimate.customerName
      const customerEmail = (estimate as any).customer?.email ?? estimate.customer?.email ?? estimate.customerEmail
      const total = (estimate as any).totals?.total ?? estimate.total
      const totalCost = (estimate as any).totals?.totalCost ?? estimate.totalCost
      const itemsCount = estimate.items?.length ?? (estimate as any).items?.length ?? 0
      const marginPct =
        typeof totalCost === "number" && totalCost > 0 && typeof total === "number"
          ? ((total - totalCost) / totalCost) * 100
          : null
      return {
        ...estimate,
        customerName,
        customerEmail,
        total,
        totalCost,
        displayId: `EST-${estimate.id.toString().padStart(4, "0")}`,
        itemsCount,
        marginPct,
        date: estimate.createdAt ? new Date(estimate.createdAt).toLocaleDateString() : "—",
      }
    })
  }, [estimates])

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Estimate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr>
                  <td className="px-6 py-4 text-sm text-muted-foreground" colSpan={8}>
                    Loading estimates...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td className="px-6 py-4 text-sm text-destructive" colSpan={8}>
                    {error}
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-sm text-muted-foreground" colSpan={8}>
                    No estimates yet. Create your first estimate.
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((estimate) => (
                  <tr
                    key={estimate.id}
                    className={cn("hover:bg-muted/50 transition-colors cursor-pointer")}
                    onClick={() => router.push(`/estimates/${estimate.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <Link
                            href={`/estimates/${estimate.id}`}
                            className="text-sm font-medium text-foreground hover:text-primary"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {estimate.displayId}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{estimate.customerName || "—"}</p>
                        <p className="text-xs text-muted-foreground">{estimate.customerEmail || ""}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{estimate.itemsCount}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{formatCurrency(estimate.total)}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {estimate.marginPct !== null ? `${estimate.marginPct.toFixed(0)}%` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={statusStyles[estimate.status] || "bg-secondary text-secondary-foreground"}
                      >
                        {estimate.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{estimate.date}</td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/estimates/${estimate.id}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                // let Link handle navigation
                              }}
                              className="flex items-center"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Revise
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleDelete(estimate.id)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
