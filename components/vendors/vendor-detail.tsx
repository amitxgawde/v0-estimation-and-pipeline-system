"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Building2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function VendorDetail({ id }: { id: string }) {
  const [vendor, setVendor] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/vendors", { cache: "no-store" })
        const data = await res.json()
        const found = (data.vendors || []).find((v: any) => String(v.id) === String(id))
        setVendor(found ?? null)
      } catch (err) {
        console.error("Failed to load vendor", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <p className="text-sm text-muted-foreground">Loading vendor...</p>
  if (!vendor) return <p className="text-sm text-muted-foreground">Vendor not found.</p>

  return (
    <div className="space-y-4">
      <Link href="/vendors" className="text-sm text-muted-foreground flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to vendors
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            {vendor.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">Contact: {vendor.contact || "—"}</p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-foreground">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            {vendor.email || "—"}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            {vendor.phone || "—"}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {vendor.address || "—"}
          </div>
          {vendor.notes && <p className="text-sm text-foreground mt-2">{vendor.notes}</p>}
        </CardContent>
      </Card>
    </div>
  )
}

