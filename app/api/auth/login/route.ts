import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const expectedUser = process.env.BASIC_AUTH_USER
  const expectedPass = process.env.BASIC_AUTH_PASS
  if (!expectedUser || !expectedPass) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 500 })
  }

  const body = await request.json().catch(() => ({}))
  const { user, pass } = body as { user?: string; pass?: string }
  if (user !== expectedUser || pass !== expectedPass) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = btoa(`${expectedUser}:${expectedPass}`)

  const res = NextResponse.json({ ok: true })
  res.cookies.set("agsoft_auth", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}

