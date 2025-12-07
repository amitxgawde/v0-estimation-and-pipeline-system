import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  const res = NextResponse.redirect(new URL("/auth", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))
  res.cookies.set("agsoft_auth", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 })
  return res
}

