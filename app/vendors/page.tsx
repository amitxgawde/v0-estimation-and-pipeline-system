import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Building2, Plus, Download } from "lucide-react"
import Link from "next/link"
import { listVendors } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function VendorsPage() {
  const vendors = listVendors()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title="Vendors" description="Track and manage supplier relationships" />
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Keep vendor SLAs, contacts, and lead times visible for the team.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <a href="/api/vendors?format=csv" download="vendors.csv">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </a>
              </Button>
              <Button asChild>
                <Link href="/vendors/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vendor
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {vendors.length === 0 && (
              <Card>
                <CardContent className="p-6 text-sm text-muted-foreground">No vendors yet. Add your first vendor.</CardContent>
              </Card>
            )}
            {vendors.map((vendor) => (
              <Card key={`${vendor.id}-${vendor.name}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div>
                    <CardTitle className="text-lg text-foreground">{vendor.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Contact: {vendor.contact}</p>
                  </div>
                  {vendor.rating && (
                    <Badge variant="secondary" className="capitalize">
                      {vendor.rating}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      Vendor
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-foreground">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {vendor.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {vendor.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {vendor.address}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/vendors/${vendor.id}`}>
                      <Building2 className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

