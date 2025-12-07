import { NextResponse } from "next/server"
import { insertVendor, listVendors } from "@/lib/db"
import { z } from "zod"

export const runtime = "nodejs"

const VendorSchema = z.object({
  name: z.string().min(1),
  contact: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  category: z.string().optional(),
  rating: z.string().optional(),
  leadTime: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = VendorSchema.parse(json)
    const id = await insertVendor(parsed)
    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    console.error("Failed to create vendor", error)
    return NextResponse.json({ error: "Invalid vendor payload" }, { status: 400 })
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

const buildVendorsCsv = (vendors: Awaited<ReturnType<typeof listVendors>>) => {
  const headers = ["id", "name", "contact", "email", "phone", "address", "category", "rating", "leadTime", "notes", "createdAt"]
  const rows = vendors.map((v) =>
    headers
      .map((key) => toCsvValue((v as Record<string, unknown>)[key]))
      .join(","),
  )
  return [headers.join(","), ...rows].join("\n")
}

export async function GET(request: Request) {
  try {
    const vendors = await listVendors()
    const url = new URL(request.url)
    const wantsCsv = url.searchParams.get("format") === "csv"

    if (wantsCsv) {
      const csv = buildVendorsCsv(vendors)
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="vendors.csv"',
        },
      })
    }

    return NextResponse.json({ vendors })
  } catch (error) {
    console.error("Failed to fetch vendors", error)
    return NextResponse.json({ error: "Could not fetch vendors" }, { status: 500 })
  }
}

