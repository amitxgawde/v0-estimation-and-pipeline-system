import { sql } from "@vercel/postgres"

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

type DbRow<T> = { id: number; data: T; created_at: string }

let tablesReady = false

async function ensureTables() {
  if (tablesReady) return
  await sql`
    CREATE TABLE IF NOT EXISTS estimates (
      id SERIAL PRIMARY KEY,
      data JSONB NOT NULL,
      customer_name TEXT,
      status TEXT,
      totals_total NUMERIC,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `
  await sql`
    CREATE TABLE IF NOT EXISTS vendors (
      id SERIAL PRIMARY KEY,
      data JSONB NOT NULL,
      name TEXT,
      email TEXT,
      phone TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      data JSONB NOT NULL,
      name TEXT,
      email TEXT,
      phone TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      data JSONB NOT NULL,
      status TEXT,
      customer TEXT,
      amount NUMERIC,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `
  await sql`
    CREATE TABLE IF NOT EXISTS pipeline (
      id INTEGER PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `
  tablesReady = true
}

function rowToEstimate(row: DbRow<EstimatePayload>) {
  return { ...row.data, id: row.id, createdAt: row.created_at }
}

function rowToVendor(row: DbRow<VendorPayload>) {
  return { ...row.data, id: row.id, createdAt: row.created_at }
}

function rowToCustomer(row: DbRow<CustomerPayload>) {
  return { ...row.data, id: row.id, createdAt: row.created_at }
}

function rowToOrder(row: DbRow<OrderPayload>) {
  return { ...row.data, id: row.id, createdAt: row.created_at }
}

// Estimates
export async function insertEstimate(payload: EstimatePayload & { id?: number }) {
  await ensureTables()
  const createdAt = payload.createdAt ?? new Date().toISOString()
  const status = payload.status
  const customerName = payload.customer?.name ?? null
  const totalsTotal = payload.totals?.total ?? null

  if (payload.id) {
    await sql`
      UPDATE estimates
      SET data = ${payload as any}, customer_name = ${customerName}, status = ${status}, totals_total = ${totalsTotal}, created_at = ${createdAt}
      WHERE id = ${payload.id}
    `
    return payload.id
  }

  const result = await sql`
    INSERT INTO estimates (data, customer_name, status, totals_total, created_at)
    VALUES (${payload as any}, ${customerName}, ${status}, ${totalsTotal}, ${createdAt})
    RETURNING id
  `
  return result.rows[0].id as number
}

export async function listEstimates() {
  await ensureTables()
  const result = await sql`SELECT id, data, created_at FROM estimates ORDER BY created_at DESC`
  return result.rows.map(rowToEstimate)
}

export async function getEstimate(id: number) {
  await ensureTables()
  const result = await sql`SELECT id, data, created_at FROM estimates WHERE id = ${id} LIMIT 1`
  const row = result.rows[0]
  return row ? rowToEstimate(row as any) : null
}

export async function deleteEstimate(id: number) {
  await ensureTables()
  await sql`DELETE FROM estimates WHERE id = ${id}`
}

// Vendors
export async function insertVendor(payload: VendorPayload & { id?: number }) {
  await ensureTables()
  const createdAt = payload.createdAt ?? new Date().toISOString()
  const name = payload.name
  const email = payload.email ?? null
  const phone = payload.phone ?? null

  if ((payload as any).id) {
    const id = (payload as any).id as number
    await sql`
      UPDATE vendors
      SET data = ${payload as any}, name = ${name}, email = ${email}, phone = ${phone}, created_at = ${createdAt}
      WHERE id = ${id}
    `
    return id
  }

  const result = await sql`
    INSERT INTO vendors (data, name, email, phone, created_at)
    VALUES (${payload as any}, ${name}, ${email}, ${phone}, ${createdAt})
    RETURNING id
  `
  return result.rows[0].id as number
}

export async function listVendors() {
  await ensureTables()
  const result = await sql`SELECT id, data, created_at FROM vendors ORDER BY created_at DESC`
  return result.rows.map(rowToVendor)
}

export async function getVendor(id: number) {
  await ensureTables()
  const result = await sql`SELECT id, data, created_at FROM vendors WHERE id = ${id} LIMIT 1`
  const row = result.rows[0]
  return row ? rowToVendor(row as any) : null
}

// Customers
export async function insertCustomer(payload: CustomerPayload & { id?: number }) {
  await ensureTables()
  const createdAt = payload.createdAt ?? new Date().toISOString()
  const name = payload.name
  const email = payload.email ?? null
  const phone = payload.phone ?? null

  if ((payload as any).id) {
    const id = (payload as any).id as number
    await sql`
      UPDATE customers
      SET data = ${payload as any}, name = ${name}, email = ${email}, phone = ${phone}, created_at = ${createdAt}
      WHERE id = ${id}
    `
    return id
  }

  const result = await sql`
    INSERT INTO customers (data, name, email, phone, created_at)
    VALUES (${payload as any}, ${name}, ${email}, ${phone}, ${createdAt})
    RETURNING id
  `
  return result.rows[0].id as number
}

export async function listCustomers() {
  await ensureTables()
  const result = await sql`SELECT id, data, created_at FROM customers ORDER BY created_at DESC`
  return result.rows.map(rowToCustomer)
}

export async function getCustomer(id: number) {
  await ensureTables()
  const result = await sql`SELECT id, data, created_at FROM customers WHERE id = ${id} LIMIT 1`
  const row = result.rows[0]
  return row ? rowToCustomer(row as any) : null
}

// Orders
export async function insertOrder(payload: OrderPayload & { id?: number }) {
  await ensureTables()
  const createdAt = payload.createdAt ?? new Date().toISOString()
  const status = payload.status ?? null
  const customer = payload.customer ?? null
  const amount = payload.amount ?? null

  if ((payload as any).id) {
    const id = (payload as any).id as number
    await sql`
      UPDATE orders
      SET data = ${payload as any}, status = ${status}, customer = ${customer}, amount = ${amount}, created_at = ${createdAt}
      WHERE id = ${id}
    `
    return id
  }

  const result = await sql`
    INSERT INTO orders (data, status, customer, amount, created_at)
    VALUES (${payload as any}, ${status}, ${customer}, ${amount}, ${createdAt})
    RETURNING id
  `
  return result.rows[0].id as number
}

export async function listOrders() {
  await ensureTables()
  const result = await sql`SELECT id, data, created_at FROM orders ORDER BY created_at DESC`
  return result.rows.map(rowToOrder)
}

export async function getOrder(id: number) {
  await ensureTables()
  const result = await sql`SELECT id, data, created_at FROM orders WHERE id = ${id} LIMIT 1`
  const row = result.rows[0]
  return row ? rowToOrder(row as any) : null
}

// Pipeline (single record)
export async function savePipeline(stages: PipelineStage[]) {
  await ensureTables()
  await sql`
    INSERT INTO pipeline (id, data, updated_at)
    VALUES (1, ${stages as any}, NOW())
    ON CONFLICT (id) DO UPDATE SET data = ${stages as any}, updated_at = NOW()
  `
}

export async function listPipeline(): Promise<PipelineStage[]> {
  await ensureTables()
  const result = await sql`SELECT data FROM pipeline WHERE id = 1 LIMIT 1`
  return result.rows[0]?.data ?? []
}

export async function updateEstimateStatus(id: number, status: string, history: Array<{ status: string; at: string }>) {
  await ensureTables()
  await sql`
    UPDATE estimates
    SET data = jsonb_set(data, '{status}', to_jsonb(${status})) || jsonb_build_object('history', to_jsonb(${history as any})),
        status = ${status}
    WHERE id = ${id}
  `
}
