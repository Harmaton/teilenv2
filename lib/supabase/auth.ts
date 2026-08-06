import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/** Returns the current session or null. Safe to call from any Server Component. */
export async function getServerSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/** Returns the current user or null. */
export async function getServerUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Use in protected Server Components / layouts.
 * Redirects to /login if there is no active session.
 */
export async function requireAuth() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  return session;
}

/**
 * Use in auth pages (login, signup, etc).
 * Redirects to /dashboard if the user is already signed in.
 */
export async function redirectIfAuthenticated(destination = "/dashboard") {
  const session = await getServerSession();
  if (session) redirect(destination);
}