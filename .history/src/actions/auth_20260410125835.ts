import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import prisma from "../lib/prisma";

export async function signUp(formatData: FormData){
    const supabase = await createClient()

    const email = formatData.get("email") as string
    const password = formatData.get("password") as string
    const fullName = formatData.get("fullName") as string
    const phoneNumber = formatData.get("phoneNumber")

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options:{
            data: { 
                full_name : fullName,
                phone_number : phoneNumber
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

