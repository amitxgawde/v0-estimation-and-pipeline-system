import { NextResponse } from "next/server"
import {
  getEstimate,
  updateEstimateStatus,
  deleteEstimate,
  insertOrder,
  findOrderByEstimateId,
  syncPipelineFromEstimate,
  syncPipelineFromOrder,
} from "@/lib/db"
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
    const current = await getEstimate(idNum)
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const history = current.history ?? []
    history.push({ status: payload.status, at: new Date().toISOString() })
    await updateEstimateStatus(idNum, payload.status, history)
    const updated = { ...current, status: payload.status, history }
    await syncPipelineFromEstimate(updated as any)

    if (payload.status === "accepted") {
      const existingOrder = await findOrderByEstimateId(idNum)
      const orderPayload = {
        id: existingOrder?.id,
        status: "confirmed",
        customer: updated.customer?.name,
        estimateId: idNum,
        amount: updated.totals?.total,
        items: updated.items?.length,
        progress: 0,
        subStatus: "Confirmed",
        paymentStatus: "pending",
        paymentReceived: 0,
        confirmedDate: new Date().toISOString(),
        notes: updated.notes,
      }
      const orderId = await insertOrder(orderPayload as any)
      await syncPipelineFromOrder({ ...orderPayload, id: orderId } as any)
    }

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

