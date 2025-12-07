"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Send, Save, Calculator, FileText, Download } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface LineItem {
  id: string
  description: string
  quantity: number
  costPrice: number
  margin: number
  sellingPrice: number
}

export function EstimateForm() {
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [internalNotes, setInternalNotes] = useState("")
  const [templateId] = useState("standard")
  const [customerOptions, setCustomerOptions] = useState<Array<{ name: string; email?: string; phone?: string }>>([])
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, costPrice: 0, margin: 25, sellingPrice: 0 },
  ])
  const [taxRate, setTaxRate] = useState(18)
  const [includeTax, setIncludeTax] = useState(true)
  const [sendAs, setSendAs] = useState<"company" | "personal">("company")
  const [savingStatus, setSavingStatus] = useState<"idle" | "submitted" | "draft">("idle")

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: "", quantity: 1, costPrice: 0, margin: 25, sellingPrice: 0 },
    ])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item

        const updated = { ...item, [field]: value }

        // Auto-calculate selling price when cost or margin changes
        if (field === "costPrice" || field === "margin") {
          const cost = field === "costPrice" ? Number(value) : item.costPrice
          const margin = field === "margin" ? Number(value) : item.margin
          updated.sellingPrice = cost * (1 + margin / 100)
        }

        // Auto-calculate margin when selling price changes
        if (field === "sellingPrice" && item.costPrice > 0) {
          const selling = Number(value)
          updated.margin = ((selling - item.costPrice) / item.costPrice) * 100
        }

        return updated
      }),
    )
  }

  const subtotal = items.reduce((sum, item) => sum + (Number(item.sellingPrice) || 0) * (Number(item.quantity) || 0), 0)
  const tax = includeTax ? subtotal * (Number(taxRate) / 100 || 0) : 0
  const total = subtotal + tax
  const totalCost = items.reduce((sum, item) => sum + (Number(item.costPrice) || 0) * (Number(item.quantity) || 0), 0)
  const totalProfit = subtotal - totalCost

  const selectedIdentity = useMemo(
    () =>
      sendAs === "company"
        ? { type: "Company", name: "The Hand Made Store", logo: "/company%20logo.png" }
        : { type: "Personal", name: "Ashwini Kurup", logo: "/personal%20logo.png" },
    [sendAs],
  )

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await fetch("/api/customers", { cache: "no-store" })
        const data = await res.json()
        setCustomerOptions(data.customers || [])
      } catch (err) {
        console.error("Failed to load customers", err)
      }
    }
    loadCustomers()
  }, [])

  const applyCustomer = (name: string) => {
    const match = customerOptions.find((c) => c.name.toLowerCase() === name.toLowerCase())
    if (match) {
      setCustomerName(match.name)
      if (match.email) setCustomerEmail(match.email)
      if (match.phone) setCustomerPhone(match.phone)
    } else {
      setCustomerName(name)
    }
  }

  const buildEstimatePayload = (status: "submitted" | "draft") => ({
    status,
    sendAs,
    identity: selectedIdentity,
    customer: {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
    },
    templateId,
    items: items.map((item) => ({
      description: item.description,
      quantity: Number(item.quantity) || 0,
      costPrice: Number(item.costPrice) || 0,
      margin: Number(item.margin) || 0,
      sellingPrice: Number(item.sellingPrice) || 0,
    })),
    totals: {
      subtotal,
      tax,
      taxRate: Number(taxRate) || 0,
      total,
      totalCost,
      totalProfit,
      includeTax,
    },
    notes,
    internalNotes,
    createdAt: new Date().toISOString(),
  })

  const persistEstimate = async (status: "submitted" | "draft") => {
    if (typeof window === "undefined") return
    setSavingStatus(status)
    const payload = buildEstimatePayload(status)
    try {
      if (customerName.trim()) {
        await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: customerName, email: customerEmail, phone: customerPhone }),
        }).catch(() => {})
      }
      const res = await fetch("/api/estimates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to save")
      alert(status === "submitted" ? "Estimate added." : "Draft saved.")
    } catch (err) {
      console.error("Failed to save estimate", err)
      alert("Could not save estimate.")
    } finally {
      setSavingStatus("idle")
    }
  }

  const buildPreviewHtml = () => {
    const itemRows =
      items.length === 0
        ? "<tr><td colspan='4' class='muted'>No items</td></tr>"
        : items
            .map(
              (item) =>
                `<tr>
                  <td>${item.description || "-"}</td>
                  <td class='num'>${item.quantity}</td>
                  <td class='num'>${item.sellingPrice.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</td>
                  <td class='num'>${(item.sellingPrice * item.quantity).toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}</td>
                </tr>`,
            )
            .join("")

    return `
      <html>
        <head>
          <title>Estimate Preview</title>
          <style>
            :root {
              color-scheme: light;
              --bg: #f8fafc;
              --card: #ffffff;
              --muted: #64748b;
              --text: #0f172a;
              --accent: #0ea5e9;
              --border: #e2e8f0;
            }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 32px;
              font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              background: var(--bg);
              color: var(--text);
              line-height: 1.5;
            }
            .wrap { max-width: 900px; margin: 0 auto; }
            .header {
              display: flex;
              align-items: center;
              gap: 16px;
              padding: 20px 24px;
              background: var(--card);
              border: 1px solid var(--border);
              border-radius: 16px;
              box-shadow: 0 12px 40px rgba(15, 23, 42, 0.08);
            }
            .logo {
              width: 64px;
              height: 64px;
              border-radius: 14px;
              overflow: hidden;
              background: #fff;
              display: grid;
              place-items: center;
              border: 1px solid var(--border);
            }
            .identity h1 {
              margin: 0;
              font-size: 22px;
              font-weight: 800;
              letter-spacing: -0.02em;
            }
            .identity .tag { display: none; }
            .grid {
              margin-top: 16px;
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
              gap: 12px;
            }
            .card {
              background: var(--card);
              border: 1px solid var(--border);
              border-radius: 14px;
              padding: 16px 18px;
              box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
            }
            .label {
              text-transform: uppercase;
              letter-spacing: 0.08em;
              font-size: 11px;
              color: var(--muted);
              font-weight: 700;
            }
            .value {
              margin-top: 6px;
              font-weight: 700;
              font-size: 16px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              border-radius: 12px;
              overflow: hidden;
            }
            th, td {
              border: 1px solid var(--border);
              padding: 10px 12px;
              text-align: left;
              font-size: 13px;
            }
            th {
              background: #f1f5f9;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              font-weight: 700;
              color: #475569;
              font-size: 12px;
            }
            tbody tr:nth-child(every) { background: #fff; }
            .num { text-align: right; font-variant-numeric: tabular-nums; }
            .muted { color: var(--muted); text-align: center; }
            .totals {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
              gap: 12px;
              margin-top: 14px;
            }
            .pill {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 6px 10px;
              border-radius: 10px;
              background: #ecfeff;
              color: #0f172a;
              font-weight: 600;
              font-size: 12px;
            }
            .notes { margin-top: 16px; }
            .notes h3 { margin: 0 0 6px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); }
            .notes p {
              margin: 0;
              background: #f8fafc;
              border: 1px solid var(--border);
              border-radius: 12px;
              padding: 12px;
              min-height: 46px;
            }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="header">
              <div class="logo">
                <img src="${selectedIdentity.logo}" alt="${selectedIdentity.name}" style="width:100%;height:100%;object-fit:contain;" />
              </div>
              <div class="identity">
                <h1>${selectedIdentity.name}</h1>
                <div class="tag">${selectedIdentity.type}</div>
              </div>
            </div>

            <div class="grid">
              <div class="card">
                <div class="label">Customer</div>
                <div class="value">${customerName || "-"}</div>
                <div class="label" style="margin-top:8px;">Contact</div>
                <div class="value" style="font-weight:600; color: var(--muted); font-size:13px;">
                  ${customerEmail || "—"}${customerPhone ? " · " + customerPhone : ""}
                </div>
              </div>
              <div class="card">
                <div class="label">Estimate For</div>
                <div class="value">Customer Copy</div>
              </div>
            </div>

            <div class="card" style="margin-top:14px;">
              <div class="label">Items</div>
              <table>
                <thead>
                  <tr><th>Description</th><th class='num'>Qty</th><th class='num'>Price</th><th class='num'>Total</th></tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>
              <div class="totals">
                <div>
                  <div class="label">Subtotal</div>
                  <div class="value">${subtotal.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</div>
                </div>
                <div>
                  <div class="label">Tax ${includeTax ? `(${taxRate}%)` : "(Disabled)"}</div>
                  <div class="value">${tax.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</div>
                </div>
                <div>
                  <div class="label">Total</div>
                  <div class="value" style="font-size:18px;">${total.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}</div>
                </div>
              </div>
            </div>

            <div class="grid notes">
              <div>
                <h3>Customer Notes</h3>
                <p>${notes || "—"}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  }

  const handleCreatePdfPreview = () => {
    if (typeof window === "undefined") return
    const html = buildPreviewHtml()
    const previewWindow = window.open("", "_blank", "width=900,height=1200")
    if (!previewWindow) return
    previewWindow.document.open()
    previewWindow.document.write(html)
    previewWindow.document.close()
    previewWindow.focus()
    previewWindow.print()
  }

  const handleDownloadPdf = () => {
    if (typeof window === "undefined") return
    const html = buildPreviewHtml()
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `estimate-${Date.now()}.html`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Form */}
      <div className="space-y-6 lg:col-span-2">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name</Label>
                <Input
                  id="customer"
                  placeholder="Enter customer name"
                  list="customer-names"
                  value={customerName}
                  onChange={(e) => applyCustomer(e.target.value)}
                />
                <datalist id="customer-names">
                  {customerOptions.map((c, idx) => (
                    <option key={`name-${c.id ?? idx}`} value={c.name} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="customer@example.com"
                  value={customerEmail}
                  list="customer-emails"
                  onChange={(e) => {
                    setCustomerEmail(e.target.value)
                    const match = customerOptions.find((c) => c.email?.toLowerCase() === e.target.value.toLowerCase())
                    if (match) {
                      setCustomerName(match.name)
                      if (match.phone) setCustomerPhone(match.phone)
                    }
                  }}
                />
                <datalist id="customer-emails">
                  {customerOptions
                    .filter((c) => c.email)
                    .map((c, idx) => (
                      <option key={`email-${c.id ?? idx}`} value={c.email} />
                    ))}
                </datalist>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  list="customer-phones"
                  onChange={(e) => {
                    setCustomerPhone(e.target.value)
                    const match = customerOptions.find((c) => c.phone === e.target.value)
                    if (match) {
                      setCustomerName(match.name)
                      if (match.email) setCustomerEmail(match.email)
                    }
                  }}
                />
                <datalist id="customer-phones">
                  {customerOptions
                    .filter((c) => c.phone)
                    .map((c, idx) => (
                      <option key={`phone-${c.id ?? idx}`} value={c.phone} />
                    ))}
                </datalist>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sending identity & templates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Send options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setSendAs("company")}
                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                  sendAs === "company" ? "border-primary ring-2 ring-primary/30" : "border-border"
                }`}
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                  <Image src="/company%20logo.png" alt="Company logo" fill className="object-contain" sizes="48px" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="text-sm font-semibold text-foreground">The Hand Made Store</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSendAs("personal")}
                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                  sendAs === "personal" ? "border-primary ring-2 ring-primary/30" : "border-border"
                }`}
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                  <Image src="/personal%20logo.png" alt="Personal logo" fill className="object-contain" sizes="48px" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Personal</p>
                  <p className="text-sm font-semibold text-foreground">Ashwini Kurup</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Line Items</CardTitle>
            <Button variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-12">
                <div className="sm:col-span-4 space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Product or service"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label>Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                    className="text-center text-base font-semibold appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="Qty"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label>Cost Price</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.costPrice || ""}
                    onChange={(e) => updateItem(item.id, "costPrice", Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label>Margin %</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={item.margin || ""}
                    onChange={(e) => updateItem(item.id, "margin", Number(e.target.value))}
                    placeholder="25"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label>Selling Price</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.sellingPrice || ""}
                    onChange={(e) => updateItem(item.id, "sellingPrice", Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
                <div className="sm:col-span-1 flex items-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes & Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes for Customer</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes visible to the customer..."
                className="min-h-[80px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internal">Internal Notes</Label>
              <Textarea
                id="internal"
                placeholder="Private notes for your team..."
                className="min-h-[80px]"
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calculator className="h-4 w-4" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="include-tax"
                    checked={includeTax}
                    onCheckedChange={(checked) => setIncludeTax(Boolean(checked))}
                  />
                  <Label htmlFor="include-tax" className="text-sm text-muted-foreground">
                    Include tax
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="h-8 w-16 text-right"
                    disabled={!includeTax}
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax Amount</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="text-xl font-bold text-foreground">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-success/10 p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-success">Your Cost</span>
                <span className="font-medium text-success">₹{totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-success">Your Profit</span>
                <span className="font-bold text-success">₹{totalProfit.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="space-y-3 p-4">
            <Button
              className="w-full"
              onClick={() => persistEstimate("submitted")}
              disabled={savingStatus === "submitted"}
            >
              <Send className="mr-2 h-4 w-4" />
              Add Estimate
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => persistEstimate("draft")}
              disabled={savingStatus === "draft"}
            >
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
          </CardContent>
        </Card>

        {/* PDF Export */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Export as PDF</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full bg-transparent" onClick={handleDownloadPdf}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
