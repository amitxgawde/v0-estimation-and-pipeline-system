import { NextResponse } from "next/server"
import { listPipeline, savePipeline } from "@/lib/db"
import { z } from "zod"

export const runtime = "nodejs"

const PipelineCardSchema = z.object({
  id: z.string(),
  customer: z.string().optional(),
  email: z.string().optional(),
  estimateId: z.string().optional(),
  amount: z.coerce.number().optional(),
  date: z.string().optional(),
  notes: z.string().optional(),
  revisions: z.coerce.number().optional(),
})

const PipelineStageSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  cards: z.array(PipelineCardSchema),
})

const PipelineSchema = z.array(PipelineStageSchema)

export async function GET() {
  try {
    const pipeline = await listPipeline()
    return NextResponse.json({ pipeline })
  } catch (error) {
    console.error("Failed to fetch pipeline", error)
    return NextResponse.json({ error: "Could not fetch pipeline" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = PipelineSchema.parse(json)
    await savePipeline(parsed)
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error("Failed to save pipeline", error)
    return NextResponse.json({ error: "Invalid pipeline payload" }, { status: 400 })
  }
}

