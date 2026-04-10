"use server"

import { redirect } from "next/navigation"
import { createClient } from "../lib/supabase/server";
import prisma from "../lib/prisma";

export async function signUp(formatData: FormData){
    const supabase = await createClient()

    const email = formatData.get("email") as string
    const password = formatData.get("password") as string
    const fullName = formatData.get("fullName") as string
    const phoneNumber = formatData.get("phoneNumber") as string | null

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options:{
            data: { 
                full_name : fullName,
                phone_number : phoneNumber,
                role: "CLIENT"
            }
        }
    })

    if (error) return { error : error.message}


    // creating user profile 
    if(data.user){
        await prisma.profile.create({
            data:{
                id:data.user.id,
                email: email,
                fullName: fullName,
                phoneNumber: phoneNumber,
                role: "CLIENT"
            }
        })
    }

    return redirect("/verify-email") 
}

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)

  const userProfile = await prisma.profile.findUnique({
    where: { id: data.user.id }
  })

  switch (userProfile?.role) {
    case 'ADMIN':
      return redirect('/admin/dashboard')
    case 'SALES_AGENT':
      return redirect('/agent/dashboard')
    case 'COACH':
      return redirect('/coach/schedule')
    default:
      return redirect('/client/home')
  }
}