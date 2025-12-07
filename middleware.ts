import { NextResponse, NextRequest } from "next/server"

function unauthorized() {
  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="AGSoft"' },
  })
}

export function middleware(request: NextRequest) {
  const expectedUser = process.env.BASIC_AUTH_USER
  const expectedPass = process.env.BASIC_AUTH_PASS

  // If env vars are not set, allow access to avoid lockout during setup.
  if (!expectedUser || !expectedPass) return NextResponse.next()

  // Allow logout route to return its own 401 response.
  const { pathname } = request.nextUrl
  if (pathname.startsWith("/logout")) return NextResponse.next()

  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Basic ")) return unauthorized()

  const base64 = authHeader.split(" ")[1] || ""
  let decoded = ""
  try {
    decoded = atob(base64)
  } catch (err) {
    return unauthorized()
  }

  const [user, ...rest] = decoded.split(":")
  const pass = rest.join(":")

  if (user !== expectedUser || pass !== expectedPass) return unauthorized()

  return NextResponse.next()
}

// Skip static assets and public files
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
}

