import { NextResponse } from "next/server"
import { listCustomers, listVendors, listEstimates, listOrders } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = (searchParams.get("q") || "").toLowerCase()

    const customers = listCustomers()
    const vendors = listVendors()
    const estimates = listEstimates()
    const orders = listOrders()

    const matches = {
      customers: customers.filter(
        (c) => c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.includes(q),
      ),
      vendors: vendors.filter(
        (v) => v.name?.toLowerCase().includes(q) || v.email?.toLowerCase().includes(q) || v.phone?.includes(q),
      ),
      estimates: estimates.filter(
        (e) =>
          e.customer.name?.toLowerCase().includes(q) ||
          e.customer.email?.toLowerCase().includes(q) ||
          e.customer.phone?.includes(q) ||
          e.identity.name?.toLowerCase().includes(q),
      ),
      orders: orders.filter(
        (o) =>
          o.customer?.toLowerCase().includes(q) ||
          (typeof o.estimateId === "string" && o.estimateId.toLowerCase().includes(q)) ||
          (typeof o.estimateId === "number" && o.estimateId.toString().includes(q)),
      ),
    }

    return NextResponse.json(matches)
  } catch (error) {
    console.error("Search failed", error)
    return NextResponse.json({ error: "Could not search" }, { status: 500 })
  }
}

