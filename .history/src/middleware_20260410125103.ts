import { NextRequest, NextResponse } from "next/server";
import { createClient } from "./lib/supabase/server";

export async function middleware(request: NextRequest){
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if(request.nextUrl.pathname.startsWith('/admin') && !user){
        return NextResponse.redirect( new URL('/login', request.url))
    }

    return NextResponse.next()
}