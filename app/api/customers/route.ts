import { NextResponse } from "next/server"
import { insertCustomer, listCustomers } from "@/lib/db"
import { z } from "zod"

export const runtime = "nodejs"

const CustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().optional(),
  phone: z.string().optional(),
  createdAt: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = CustomerSchema.parse(json)
    const id = await insertCustomer(parsed)
    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    console.error("Failed to create customer", error)
    return NextResponse.json({ error: "Invalid customer payload" }, { status: 400 })
  }
}

const toCsvValue = (value: unknown) => {
  if (value === null || value === undefined) return ""
  const str = String(value)
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

const buildCustomersCsv = (customers: Awaited<ReturnType<typeof listCustomers>>) => {
  const headers = ["id", "name", "email", "phone", "createdAt"]
  const rows = customers.map((c) =>
    headers
      .map((key) => toCsvValue((c as Record<string, unknown>)[key]))
      .join(","),
  )
  return [headers.join(","), ...rows].join("\n")
}

export async function GET(request: Request) {
  try {
    const customers = await listCustomers()
    const url = new URL(request.url)
    const wantsCsv = url.searchParams.get("format") === "csv"

    if (wantsCsv) {
      const csv = buildCustomersCsv(customers)
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="customers.csv"',
        },
      })
    }

    return NextResponse.json({ customers })
  } catch (error) {
    console.error("Failed to fetch customers", error)
    return NextResponse.json({ error: "Could not fetch customers" }, { status: 500 })
  }
}

