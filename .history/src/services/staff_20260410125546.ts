import { createClient } from "../lib/supabase/server";

export async function createStaffMember( email: string, fullName: string, phoneNumber: string, role: 'ADMIN' | 'SALES_AGENT' | 'COACH'){
    const supabase = await createClient()

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password:
    })
}