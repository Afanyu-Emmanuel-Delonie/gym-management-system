import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

// All redirect targets are hardcoded — never derived from user input (prevents SSRF/open redirect)
const ROLE_HOME: Record<string, string> = {
  ADMIN:        "/admin/dashboard",
  SALES_AGENT:  "/agent/dashboard",
  COACH:        "/coach/dashboard",
  NUTRITIONIST: "/agent/dashboard",
}

const ROLE_ALLOWED_PREFIXES: Record<string, string[]> = {
  ADMIN:        ["/admin", "/agent", "/coach", "/profile", "/notifications"],
  SALES_AGENT:  ["/agent", "/profile", "/notifications"],
  COACH:        ["/coach", "/profile", "/notifications"],
  NUTRITIONIST: ["/agent", "/profile", "/notifications"],
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          ),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Safe hardcoded redirect — not derived from request.url path
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin))
  }

  // Role read from app_metadata (server-set, cannot be spoofed by client JWT claims)
  // Falls back to user_metadata for seed/legacy compatibility
  const role: string = (user.app_metadata?.role ?? user.user_metadata?.role ?? "") as string

  const { pathname } = request.nextUrl
  const allowed = ROLE_ALLOWED_PREFIXES[role] ?? []
  const isAllowed = allowed.some((prefix) => pathname.startsWith(prefix))

  if (!isAllowed) {
    // Safe hardcoded redirect — never uses user-supplied URL
    const home = ROLE_HOME[role] ?? "/unauthorized"
    return NextResponse.redirect(new URL(home, request.nextUrl.origin))
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/agent/:path*", "/coach/:path*", "/profile/:path*", "/notifications/:path*"],
}
