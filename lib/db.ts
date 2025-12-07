import fs from "fs"
import path from "path"

type EstimatePayload = {
  status: "submitted" | "draft" | "sent" | "viewed" | "accepted" | "negotiating" | "rejected"
  sendAs: "company" | "personal"
  identity: { type: string; name: string; logo?: string }
  customer: { name?: string; email?: string; phone?: string }
  templateId?: string
  items: Array<{
    description?: string
    quantity: number
    costPrice: number
    margin: number
    sellingPrice: number
  }>
  totals: {
    subtotal: number
    tax: number
    taxRate: number
    total: number
    totalCost: number
    totalProfit: number
  }
  notes?: string
  internalNotes?: string
  createdAt?: string
  history?: Array<{ status: string; at: string }>
}

type VendorPayload = {
  name: string
  contact?: string
  email?: string
  phone?: string
  address?: string
  category?: string
  rating?: string
  leadTime?: string
  notes?: string
  createdAt?: string
}

type CustomerPayload = {
  name: string
  email?: string
  phone?: string
  createdAt?: string
}

type OrderPayload = {
  status: string
  customer?: string
  estimateId?: number | string
  amount?: number
  items?: number
  progress?: number
  subStatus?: string
  paymentStatus?: string
  paymentReceived?: number
  confirmedDate?: string
  expectedDelivery?: string
  createdAt?: string
  dueDate?: string
  paidAt?: string
  notes?: string
}

type PipelineCard = {
  id: string
  customer?: string
  email?: string
  estimateId?: string
  amount?: number
  date?: string
  notes?: string
  revisions?: number
}

type PipelineStage = {
  id: string
  name: string
  color: string
  cards: PipelineCard[]
}

const dataDir = path.join(process.cwd(), "data")
const jsonPath = path.join(dataDir, "app.json")

type DbShape = {
  estimates: Array<
    EstimatePayload & {
      id: number
      items: EstimatePayload["items"]
    }
  >
  vendors: Array<VendorPayload & { id: number }>
  customers: Array<CustomerPayload & { id: number }>
  orders: Array<OrderPayload & { id: number }>
  pipeline: PipelineStage[]
}

function ensureStore(): DbShape {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  if (!fs.existsSync(jsonPath)) {
    const empty: DbShape = { estimates: [], vendors: [], customers: [], orders: [], pipeline: [] }
    fs.writeFileSync(jsonPath, JSON.stringify(empty, null, 2), "utf8")
    return empty
  }
  const raw = fs.readFileSync(jsonPath, "utf8")
  try {
    const parsed = JSON.parse(raw) as Partial<DbShape>
    return {
      estimates: parsed.estimates ?? [],
      vendors: parsed.vendors ?? [],
      customers: parsed.customers ?? [],
      orders: parsed.orders ?? [],
      pipeline: parsed.pipeline ?? [],
    }
  } catch {
    const empty: DbShape = { estimates: [], vendors: [], customers: [], orders: [], pipeline: [] }
    fs.writeFileSync(jsonPath, JSON.stringify(empty, null, 2), "utf8")
    return empty
  }
}

function saveStore(db: DbShape) {
  fs.writeFileSync(jsonPath, JSON.stringify(db, null, 2), "utf8")
}

export function insertEstimate(payload: EstimatePayload & { id?: number }) {
  const db = ensureStore()
  const nextId = payload.id ?? (db.estimates.at(-1)?.id ?? 0) + 1
  const createdAt = payload.createdAt ?? new Date().toISOString()
  const record = { ...payload, id: nextId, createdAt, items: payload.items, history: payload.history ?? [] }
  const existingIdx = db.estimates.findIndex((e) => e.id === nextId)
  if (existingIdx >= 0) {
    db.estimates[existingIdx] = record
  } else {
    db.estimates.push(record)
  }
  saveStore(db)
  return nextId
}

export function listEstimates() {
  const db = ensureStore()
  return db.estimates.slice().sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
}

export function deleteEstimate(id: number) {
  const db = ensureStore()
  db.estimates = db.estimates.filter((e) => e.id !== id)
  saveStore(db)
}

export function insertVendor(payload: VendorPayload) {
  const db = ensureStore()
  const nextId = (db.vendors.at(-1)?.id ?? 0) + 1
  const createdAt = payload.createdAt ?? new Date().toISOString()
  db.vendors.push({ ...payload, id: nextId, createdAt })
  saveStore(db)
  return nextId
}

export function listVendors() {
  const db = ensureStore()
  return db.vendors.slice().sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
}

export function insertCustomer(payload: CustomerPayload) {
  const db = ensureStore()
  const nextId = (db.customers.at(-1)?.id ?? 0) + 1
  const createdAt = payload.createdAt ?? new Date().toISOString()
  db.customers.push({ ...payload, id: nextId, createdAt })
  saveStore(db)
  return nextId
}

export function listCustomers() {
  const db = ensureStore()
  return db.customers.slice().sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
}

export function insertOrder(payload: OrderPayload) {
  const db = ensureStore()
  const nextId = (db.orders.at(-1)?.id ?? 0) + 1
  const createdAt = payload.createdAt ?? new Date().toISOString()
  db.orders.push({ ...payload, id: nextId, createdAt })
  saveStore(db)
  return nextId
}

export function listOrders() {
  const db = ensureStore()
  return db.orders.slice().sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
}

export function savePipeline(stages: PipelineStage[]) {
  const db = ensureStore()
  db.pipeline = stages
  saveStore(db)
}

export function listPipeline(): PipelineStage[] {
  const db = ensureStore()
  return db.pipeline
}

