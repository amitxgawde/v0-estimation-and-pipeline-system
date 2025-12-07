"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Send, Save, Calculator } from "lucide-react"

interface LineItem {
  id: string
  description: string
  quantity: number
  costPrice: number
  margin: number
  sellingPrice: number
}

const templates = [
  { id: "blank", name: "Blank Estimate" },
  { id: "product", name: "Product Sale" },
  { id: "service", name: "Service Package" },
  { id: "project", name: "Project Quote" },
]

export function EstimateForm() {
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, costPrice: 0, margin: 25, sellingPrice: 0 },
  ])
  const [taxRate, setTaxRate] = useState(18)

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

  const subtotal = items.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0)
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax
  const totalCost = items.reduce((sum, item) => sum + item.costPrice * item.quantity, 0)
  const totalProfit = subtotal - totalCost

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
                <Input id="customer" placeholder="Enter customer name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="customer@example.com" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select defaultValue="blank">
                  <SelectTrigger id="template">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                <div className="sm:col-span-1 space-y-2">
                  <Label>Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
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
              <Textarea id="notes" placeholder="Add any notes visible to the customer..." className="min-h-[80px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internal">Internal Notes</Label>
              <Textarea id="internal" placeholder="Private notes for your team..." className="min-h-[80px]" />
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
                <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="h-8 w-16 text-right"
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax Amount</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="text-xl font-bold text-foreground">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-success/10 p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-success">Your Cost</span>
                <span className="font-medium text-success">${totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-success">Your Profit</span>
                <span className="font-bold text-success">${totalProfit.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="space-y-3 p-4">
            <Button className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Send Estimate
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
          </CardContent>
        </Card>

        {/* Shareable Link Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Shareable Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-xs text-muted-foreground mb-1">Link will be generated after saving</p>
              <code className="text-xs text-foreground">estiflow.com/e/xxxxx</code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
