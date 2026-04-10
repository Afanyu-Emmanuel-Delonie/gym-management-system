import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function proxy(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.redirect(new URL("/login", request.url))

  const role = user.user_metadata?.role as string | undefined

  if (request.nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  if (request.nextUrl.pathname.startsWith("/agent") && role !== "SALES_AGENT" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  if (request.nextUrl.pathname.startsWith("/coach") && role !== "COACH" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/agent/:path*", "/coach/:path*"],
}
