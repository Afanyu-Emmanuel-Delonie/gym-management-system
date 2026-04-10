import { createClient } from "../lib/supabase/server";

export async function signUp(formatData: FormData){
    const supabase = await createClient()

    const email = formatData.get("email")
}