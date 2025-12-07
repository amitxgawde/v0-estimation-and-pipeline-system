import { NextResponse } from "next/server"
import { insertOrder, listOrders } from "@/lib/db"
import { z } from "zod"

export const runtime = "nodejs"

const OrderSchema = z.object({
  status: z.string(),
  customer: z.string().optional(),
  estimateId: z.union([z.string(), z.number()]).optional(),
  amount: z.coerce.number().optional(),
  items: z.coerce.number().optional(),
  progress: z.coerce.number().optional(),
  subStatus: z.string().optional(),
  paymentStatus: z.string().optional(),
  paymentReceived: z.coerce.number().optional(),
  confirmedDate: z.string().optional(),
  expectedDelivery: z.string().optional(),
  createdAt: z.string().optional(),
})

export async function GET() {
  try {
    const orders = await listOrders()
    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Failed to fetch orders", error)
    return NextResponse.json({ error: "Could not fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = OrderSchema.parse(json)
    const id = await insertOrder(parsed)
    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    console.error("Failed to create order", error)
    return NextResponse.json({ error: "Invalid order payload" }, { status: 400 })
  }
}

