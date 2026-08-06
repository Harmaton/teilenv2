import { createClient } from "@/lib/supabase/server"
import { User } from "@supabase/supabase-js"
import { redirect } from "next/navigation"

export type AuthResult =
  | { success: true; user: User }
  | { success: false; user: null; error: string }

export async function getAuthUser(): Promise<AuthResult> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) throw new Error(error.message)
    if (!user) throw new Error("No active session")

    return { success: true, user }
  } catch (error) {
    return {
      success: false,
      user: null,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/** Use in server components/pages — redirects to / if no session */
export async function requireAuth(): Promise<User> {
  const result = await getAuthUser()
  if (!result.success) redirect("/")
  return result.user
}