import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const redirectUrl = new URL("/auth", url.origin)
  
  const res = NextResponse.redirect(redirectUrl)
  res.cookies.set("agsoft_auth", "", { 
    httpOnly: true, 
    secure: true, 
    sameSite: "lax", 
    path: "/", 
    maxAge: 0 
  })
  return res
}
