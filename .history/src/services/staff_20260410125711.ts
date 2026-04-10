import { createClient } from "../lib/supabase/server";

export async function createStaffMember(
  email: string,
  fullName: string,
  phoneNumber: string,
  role: "ADMIN" | "SALES_AGENT" | "COACH",
) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: Math.random().toString(36).slice(-12),
    email_confirm: true,
    user_metadata: { full_name: fullName,phoneNumber: phoneNumber, role: role },
  })

  if (error) throw new Error(error.message)


}
