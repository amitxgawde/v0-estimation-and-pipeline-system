import { NextResponse } from "next/server"
import { listEstimates, insertEstimate, deleteEstimate } from "@/lib/db"
import { z } from "zod"

export const runtime = "nodejs"

const StatusSchema = z.object({
  status: z.enum(["submitted", "draft", "sent", "viewed", "accepted", "negotiating", "rejected"]),
})

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const idNum = Number(id)
  const estimates = listEstimates()
  const found = estimates.find((e) => e.id === idNum)
  if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(found)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const idNum = Number(id)
    const payload = StatusSchema.parse(await request.json())
    const estimates = listEstimates()
    const idx = estimates.findIndex((e) => e.id === idNum)
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const history = estimates[idx].history ?? []
    history.push({ status: payload.status, at: new Date().toISOString() })
    const updated = { ...estimates[idx], status: payload.status, history }
    insertEstimate({ ...updated, id: updated.id }) // persist
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
    deleteEstimate(idNum)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Failed to delete estimate", err)
    return NextResponse.json({ error: "Could not delete" }, { status: 500 })
  }
}

