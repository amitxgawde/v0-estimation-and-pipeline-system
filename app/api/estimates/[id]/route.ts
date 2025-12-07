import { NextResponse } from "next/server"
import { listEstimates, getEstimate, updateEstimateStatus, deleteEstimate } from "@/lib/db"
import { z } from "zod"

export const runtime = "nodejs"

const StatusSchema = z.object({
  status: z.enum(["submitted", "draft", "sent", "viewed", "accepted", "negotiating", "rejected"]),
})

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const idNum = Number(id)
  const found = await getEstimate(idNum)
  if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(found)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const idNum = Number(id)
    const payload = StatusSchema.parse(await request.json())
    const estimates = await listEstimates()
    const current = estimates.find((e) => e.id === idNum)
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const history = current.history ?? []
    history.push({ status: payload.status, at: new Date().toISOString() })
    await updateEstimateStatus(idNum, payload.status, history)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Failed to update estimate", err)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const idNum = Number(id)
    await deleteEstimate(idNum)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Failed to delete estimate", err)
    return NextResponse.json({ error: "Could not delete" }, { status: 500 })
  }
}

