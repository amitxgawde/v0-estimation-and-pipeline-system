import { NextResponse } from "next/server"
import { insertEstimate, listEstimates, syncPipelineFromEstimate } from "@/lib/db"
import { z } from "zod"

export const runtime = "nodejs"

const EstimateItemSchema = z.object({
  description: z.string().optional(),
  quantity: z.coerce.number().int().min(1),
  costPrice: z.coerce.number().nonnegative(),
  margin: z.coerce.number(),
  sellingPrice: z.coerce.number().nonnegative(),
})

const EstimateSchema = z.object({
  status: z.enum(["submitted", "draft"]),
  sendAs: z.enum(["company", "personal"]),
  identity: z.object({
    type: z.string(),
    name: z.string(),
    logo: z.string().optional().nullable(),
  }),
  customer: z.object({
    name: z.string().optional().default(""),
    email: z.string().optional().default(""),
    phone: z.string().optional().default(""),
  }),
  templateId: z.string().optional().default(""),
  items: z.array(EstimateItemSchema),
  totals: z.object({
    subtotal: z.coerce.number(),
    tax: z.coerce.number(),
    taxRate: z.coerce.number(),
    total: z.coerce.number(),
    totalCost: z.coerce.number(),
    totalProfit: z.coerce.number(),
  }),
  notes: z.string().optional().default(""),
  internalNotes: z.string().optional().default(""),
  createdAt: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = EstimateSchema.parse(json)
    const normalized = {
      ...parsed,
      identity: { ...parsed.identity, logo: parsed.identity.logo || undefined },
    }
    const id = await insertEstimate(normalized)
    await syncPipelineFromEstimate({ ...normalized, id })
    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    console.error("Failed to create estimate", error)
    return NextResponse.json({ error: "Invalid estimate payload" }, { status: 400 })
  }
}

export async function GET() {
  try {
    const estimates = await listEstimates()
    return NextResponse.json({ estimates })
  } catch (error) {
    console.error("Failed to fetch estimates", error)
    return NextResponse.json({ error: "Could not fetch estimates" }, { status: 500 })
  }
}

