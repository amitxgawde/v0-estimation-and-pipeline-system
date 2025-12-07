import { NextResponse, NextRequest } from "next/server"

function getExpectedToken() {
  const expectedUser = process.env.BASIC_AUTH_USER
  const expectedPass = process.env.BASIC_AUTH_PASS
  if (!expectedUser || !expectedPass) return null
  return Buffer.from(`${expectedUser}:${expectedPass}`).toString("base64")
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only allow these paths without auth
  const publicPaths = ["/auth", "/api/auth/login"]
  const isPublic =
    publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".ico")

  if (isPublic) {
    return NextResponse.next()
  }

  const expectedToken = getExpectedToken()
  // If env vars are not set, redirect to auth to avoid showing app
  if (!expectedToken) {
    const loginUrl = new URL("/auth", request.url)
    loginUrl.searchParams.set("error", "not_configured")
    return NextResponse.redirect(loginUrl)
  }

  const cookie = request.cookies.get("agsoft_auth")?.value
  if (cookie === expectedToken) {
    return NextResponse.next()
  }

  // Redirect to login page
  const loginUrl = new URL("/auth", request.url)
  loginUrl.searchParams.set("from", pathname || "/")
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image).*)",
  ],
}
