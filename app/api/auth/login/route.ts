import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const expectedUser = process.env.BASIC_AUTH_USER
  const expectedPass = process.env.BASIC_AUTH_PASS
  
  if (!expectedUser || !expectedPass) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 500 })
  }

  let body: { user?: string; pass?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const { user, pass } = body
  
  if (!user || !pass || user !== expectedUser || pass !== expectedPass) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = Buffer.from(`${expectedUser}:${expectedPass}`).toString("base64")

  const res = NextResponse.json({ ok: true })
  res.cookies.set("agsoft_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}
