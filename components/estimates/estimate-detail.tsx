"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, ExternalLink, Edit, Send, CheckCircle, XCircle, Clock, FileText, MessageSquare } from "lucide-react"

interface EstimateDetailProps {
  id: string
}

const estimate = {
  id: "EST-001",
  customer: "Acme Corp",
  email: "purchasing@acme.com",
  phone: "+91 98765 43210",
  status: "sent",
  createdAt: "Dec 5, 2025",
  validUntil: "Dec 20, 2025",
  items: [
    { description: "Industrial Motor Unit", quantity: 5, costPrice: 1500, margin: 25, sellingPrice: 1875 },
    { description: "Installation Service", quantity: 1, costPrice: 800, margin: 40, sellingPrice: 1120 },
    { description: "Annual Maintenance Contract", quantity: 1, costPrice: 1200, margin: 30, sellingPrice: 1560 },
  ],
  subtotal: 12055,
  tax: 2169.9,
  total: 14224.9,
  notes: "Delivery within 2 weeks. Installation included.",
  revisions: [{ version: 1, date: "Dec 5, 2025", amount: "$14,224.90", status: "sent" }],
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
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Content */}
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">{estimate.customer}</CardTitle>
              <p className="text-sm text-muted-foreground">{estimate.email}</p>
            </div>
            <Badge variant="outline" className={statusStyles[estimate.status]}>
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
                      {estimate.items.map((item, index) => (
                        <tr key={index}>
                          <td className="py-3 text-sm text-foreground">{item.description}</td>
                          <td className="py-3 text-center text-sm text-foreground">{item.quantity}</td>
                          <td className="py-3 text-right text-sm text-muted-foreground">
                            ${item.costPrice.toFixed(2)}
                          </td>
                          <td className="py-3 text-right text-sm text-muted-foreground">{item.margin}%</td>
                          <td className="py-3 text-right text-sm text-foreground">${item.sellingPrice.toFixed(2)}</td>
                          <td className="py-3 text-right text-sm font-medium text-foreground">
                            ${(item.sellingPrice * item.quantity).toFixed(2)}
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
                          ${estimate.subtotal.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={5} className="py-1 text-right text-sm text-muted-foreground">
                          Tax (18%)
                        </td>
                        <td className="py-1 text-right text-sm text-foreground">${estimate.tax.toFixed(2)}</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td colSpan={5} className="py-3 text-right font-medium text-foreground">
                          Total
                        </td>
                        <td className="py-3 text-right text-lg font-bold text-foreground">
                          ${estimate.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <div className="space-y-3">
                  {estimate.revisions.map((rev, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Version {rev.version}</p>
                          <p className="text-xs text-muted-foreground">{rev.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground">{rev.amount}</span>
                        <Badge variant="outline" className={statusStyles[rev.status]}>
                          {rev.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <div className="rounded-lg bg-secondary p-4">
                  <p className="text-sm text-foreground">{estimate.notes}</p>
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
            <Button className="w-full justify-start">
              <Edit className="mr-2 h-4 w-4" />
              Revise Estimate
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Send className="mr-2 h-4 w-4" />
              Resend to Customer
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview Link
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
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Accepted
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-warning border-warning/20 hover:bg-warning/10 bg-transparent"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Mark as Negotiating
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive/10 bg-transparent"
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
                  <p className="text-sm font-medium text-foreground">Estimate Sent</p>
                  <p className="text-xs text-muted-foreground">Dec 5, 2025 at 2:30 PM</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Awaiting Response</p>
                  <p className="text-xs text-muted-foreground">Valid until Dec 20, 2025</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
