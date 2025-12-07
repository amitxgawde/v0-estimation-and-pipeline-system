"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, CheckCircle, XCircle, Clock, FileText, MessageSquare, Send } from "lucide-react"
import Link from "next/link"

interface EstimateDetailProps {
  id: string
}

const statusStyles: Record<string, string> = {
  draft: "bg-secondary text-secondary-foreground",
  sent: "bg-info/10 text-info border-info/20",
  viewed: "bg-warning/10 text-warning border-warning/20",
  accepted: "bg-success/10 text-success border-success/20",
  negotiating: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
}

export function EstimateDetail({ id }: EstimateDetailProps) {
  const [estimate, setEstimate] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingStatus, setSavingStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const displayId = estimate?.id ? `EST-${estimate.id.toString().padStart(4, "0")}` : id

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) throw new Error("Missing id")
        const res = await fetch(`/api/estimates/${id}`, { cache: "no-store" })
        if (!res.ok) throw new Error("Not found")
        const data = await res.json()
        setEstimate(data)
      } catch (err) {
        console.error("Failed to load estimate", err)
        setError("Estimate not found or was deleted.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const totals = useMemo(() => {
    if (!estimate?.totals) return { subtotal: 0, tax: 0, total: 0 }
    return {
      subtotal: estimate.totals.subtotal || 0,
      tax: estimate.totals.tax || 0,
      total: estimate.totals.total || 0,
    }
  }, [estimate])

  const handleStatus = async (status: string) => {
    setSavingStatus(status)
    try {
      const res = await fetch(`/api/estimates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      setEstimate((prev: any) => (prev ? { ...prev, status } : prev))
    } catch (err) {
      console.error(err)
      alert("Could not update status")
    } finally {
      setSavingStatus(null)
    }
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading estimate...</div>
  }

  if (error || !estimate) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">
          {error || "Estimate not found."}
          <div className="mt-4">
            <Link href="/estimates" className="text-primary underline">
              Back to estimates
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Content */}
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">{estimate.customer?.name || displayId || "Estimate"}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {estimate.customer?.email || ""} {estimate.customer?.phone ? `· ${estimate.customer.phone}` : ""}
              </p>
            </div>
            <Badge variant="outline" className={statusStyles[estimate.status] || "bg-secondary text-secondary-foreground"}>
              {estimate.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="items">
              <TabsList>
                <TabsTrigger value="items">Line Items</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left text-xs font-medium uppercase text-muted-foreground">
                          Description
                        </th>
                        <th className="pb-3 text-center text-xs font-medium uppercase text-muted-foreground">Qty</th>
                        <th className="pb-3 text-right text-xs font-medium uppercase text-muted-foreground">Cost</th>
                        <th className="pb-3 text-right text-xs font-medium uppercase text-muted-foreground">Margin</th>
                        <th className="pb-3 text-right text-xs font-medium uppercase text-muted-foreground">Price</th>
                        <th className="pb-3 text-right text-xs font-medium uppercase text-muted-foreground">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {estimate.items?.map((item: any, index: number) => (
                        <tr key={index}>
                          <td className="py-3 text-sm text-foreground">{item.description}</td>
                          <td className="py-3 text-center text-sm text-foreground">{item.quantity}</td>
                          <td className="py-3 text-right text-sm text-muted-foreground">
                            {item.costPrice.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                          </td>
                          <td className="py-3 text-right text-sm text-muted-foreground">{item.margin}%</td>
                          <td className="py-3 text-right text-sm text-foreground">
                            {item.sellingPrice.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                          </td>
                          <td className="py-3 text-right text-sm font-medium text-foreground">
                            {(item.sellingPrice * item.quantity).toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-border">
                        <td colSpan={5} className="py-3 text-right text-sm text-muted-foreground">
                          Subtotal
                        </td>
                        <td className="py-3 text-right text-sm font-medium text-foreground">
                          {totals.subtotal.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={5} className="py-1 text-right text-sm text-muted-foreground">
                          Tax
                        </td>
                        <td className="py-1 text-right text-sm text-foreground">
                          {totals.tax.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                        </td>
                      </tr>
                      <tr className="border-t border-border">
                        <td colSpan={5} className="py-3 text-right font-medium text-foreground">
                          Total
                        </td>
                        <td className="py-3 text-right text-lg font-bold text-foreground">
                          {totals.total.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <div className="space-y-3">
                  {(estimate.history ?? [])
                    .slice()
                    .reverse()
                    .map((h: any, index: number) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-foreground capitalize">{h.status}</p>
                            <p className="text-xs text-muted-foreground">
                              {h.at ? new Date(h.at).toLocaleString() : ""}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={statusStyles[h.status] || "bg-secondary text-secondary-foreground"}
                        >
                          {h.status}
                        </Badge>
                      </div>
                    ))}
                  {(estimate.history ?? []).length === 0 && (
                    <p className="text-sm text-muted-foreground">No history yet.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <div className="rounded-lg bg-secondary p-4">
                  <p className="text-sm text-foreground">{estimate.notes || "No notes yet."}</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" onClick={() => handleStatus("submitted")} disabled={!!savingStatus}>
              <Edit className="mr-2 h-4 w-4" />
              Mark as Draft/Revise
            </Button>
          </CardContent>
        </Card>

        {/* Customer Response */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start text-success border-success/20 hover:bg-success/10 bg-transparent"
              disabled={savingStatus === "accepted"}
              onClick={() => handleStatus("accepted")}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Accepted
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-warning border-warning/20 hover:bg-warning/10 bg-transparent"
              disabled={savingStatus === "negotiating"}
              onClick={() => handleStatus("negotiating")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Mark as Negotiating
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive/10 bg-transparent"
              disabled={savingStatus === "rejected"}
              onClick={() => handleStatus("rejected")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Mark as Rejected
            </Button>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-info/20">
                    <Send className="h-3 w-3 text-info" />
                  </div>
                  <div className="h-full w-px bg-border" />
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-foreground">Created</p>
                  <p className="text-xs text-muted-foreground">
                    {estimate.createdAt ? new Date(estimate.createdAt).toLocaleString() : "—"}
                  </p>
                </div>
              </div>
              {(estimate.history ?? []).slice().reverse().map((h: any, idx: number) => (
                <div className="flex gap-3" key={idx}>
                  <div className="flex flex-col items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground capitalize">{h.status}</p>
                    <p className="text-xs text-muted-foreground">{h.at ? new Date(h.at).toLocaleString() : "—"}</p>
                  </div>
                </div>
              ))}
              {(estimate.history ?? []).length === 0 && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Status</p>
                    <p className="text-xs text-muted-foreground">{estimate.status}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
