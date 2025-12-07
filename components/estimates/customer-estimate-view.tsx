"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, MessageSquare, FileText } from "lucide-react"

interface CustomerEstimateViewProps {
  id: string
}

const estimate = {
  id: "EST-001",
  company: "Your Business Name",
  customer: "Acme Corp",
  items: [
    { description: "Industrial Motor Unit", quantity: 5, price: 1875 },
    { description: "Installation Service", quantity: 1, price: 1120 },
    { description: "Annual Maintenance Contract", quantity: 1, price: 1560 },
  ],
  subtotal: 12055,
  tax: 2169.9,
  total: 14224.9,
  notes: "Delivery within 2 weeks. Installation included.",
  validUntil: "Dec 20, 2025",
}

export function CustomerEstimateView({ id }: CustomerEstimateViewProps) {
  const [showNegotiateForm, setShowNegotiateForm] = useState(false)
  const [negotiateMessage, setNegotiateMessage] = useState("")
  const [responded, setResponded] = useState<"accepted" | "rejected" | null>(null)

  const handleAccept = () => {
    setResponded("accepted")
  }

  const handleReject = () => {
    setResponded("rejected")
  }

  if (responded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            {responded === "accepted" ? (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Estimate Accepted</h2>
                <p className="text-muted-foreground">
                  Thank you! The seller has been notified and will be in touch shortly.
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Estimate Declined</h2>
                <p className="text-muted-foreground">The seller has been notified of your decision.</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{estimate.company}</h1>
          <p className="text-muted-foreground">Estimate for {estimate.customer}</p>
        </div>

        {/* Estimate Card */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Estimate #{id}</CardTitle>
              <p className="text-sm text-muted-foreground">Valid until {estimate.validUntil}</p>
            </div>
            <Badge variant="outline" className="bg-info/10 text-info border-info/20">
              Pending Response
            </Badge>
          </CardHeader>
          <CardContent>
            {/* Items */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-medium uppercase text-muted-foreground">Description</th>
                    <th className="pb-3 text-center text-xs font-medium uppercase text-muted-foreground">Qty</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase text-muted-foreground">Price</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {estimate.items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-3 text-sm text-foreground">{item.description}</td>
                      <td className="py-3 text-center text-sm text-foreground">{item.quantity}</td>
                      <td className="py-3 text-right text-sm text-foreground">${item.price.toFixed(2)}</td>
                      <td className="py-3 text-right text-sm font-medium text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border">
                    <td colSpan={3} className="py-3 text-right text-sm text-muted-foreground">
                      Subtotal
                    </td>
                    <td className="py-3 text-right text-sm font-medium text-foreground">
                      ${estimate.subtotal.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-1 text-right text-sm text-muted-foreground">
                      Tax (18%)
                    </td>
                    <td className="py-1 text-right text-sm text-foreground">${estimate.tax.toFixed(2)}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td colSpan={3} className="py-3 text-right font-medium text-foreground">
                      Total
                    </td>
                    <td className="py-3 text-right text-xl font-bold text-foreground">${estimate.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Notes */}
            {estimate.notes && (
              <div className="rounded-lg bg-secondary p-4 mb-6">
                <p className="text-sm text-foreground">{estimate.notes}</p>
              </div>
            )}

            {/* Negotiate Form */}
            {showNegotiateForm && (
              <div className="mb-6 rounded-lg border border-border p-4">
                <h3 className="text-sm font-medium text-foreground mb-3">Send a Message</h3>
                <Textarea
                  placeholder="Enter your questions or counter-offer..."
                  value={negotiateMessage}
                  onChange={(e) => setNegotiateMessage(e.target.value)}
                  className="mb-3"
                />
                <div className="flex gap-2">
                  <Button size="sm">Send Message</Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowNegotiateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1" onClick={handleAccept}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Accept Estimate
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setShowNegotiateForm(!showNegotiateForm)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Negotiate
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-destructive hover:text-destructive bg-transparent"
                onClick={handleReject}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Decline
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">Powered by EstiFlow</p>
      </div>
    </div>
  )
}
