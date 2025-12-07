import { NextResponse, NextRequest } from "next/server"

function getExpectedToken() {
  const expectedUser = process.env.BASIC_AUTH_USER
  const expectedPass = process.env.BASIC_AUTH_PASS
  if (!expectedUser || !expectedPass) return null
  // Stable token derived from env creds
  return btoa(`${expectedUser}:${expectedPass}`)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip auth for login/logout and static assets
  const publicPaths = ["/auth", "/api/auth/login", "/logout", "/favicon.ico", "/robots.txt", "/sitemap.xml"]
  if (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    publicPaths.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next()
  }

  const expectedToken = getExpectedToken()
  // If env vars are not set, allow access to avoid lockout during setup.
  if (!expectedToken) return NextResponse.next()

  const cookie = request.cookies.get("agsoft_auth")?.value
  if (cookie === expectedToken) return NextResponse.next()

  const loginUrl = new URL("/auth", request.url)
  loginUrl.searchParams.set("from", pathname || "/")
  return NextResponse.redirect(loginUrl)
}

// Apply to all routes except static assets handled above
export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
}

