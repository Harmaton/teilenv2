"use server";

import { createClient } from "@/lib/supabase/server";
import { signup } from "@/_actions/auth";
import { cookies } from "next/headers";

// ─── Validate invite token ────────────────────────────────────────────────────

export type ValidateInviteResult =
  | { success: true;  sessionToken: string }
  | { success: false; error: string };

export async function validateInviteToken(
  token: string,
  email: string
): Promise<ValidateInviteResult> {
  if (!token || !email) {
    return { success: false, error: "Missing token or email." };
  }

  const supabase = await createClient();

  const { data: invite, error: inviteError } = await supabase
    .from("pending_invites")
    .select("*")
    .eq("invite_token", token)
    .eq("email", email.toLowerCase())
    .eq("status", "pending")
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (inviteError) {
    console.error("[validateInviteToken] DB error:", inviteError);
    return { success: false, error: "Failed to validate invitation." };
  }
  if (!invite) {
    return { success: false, error: "Invalid or expired invitation." };
  }

  const { randomBytes } = await import("crypto");
  const sessionToken = randomBytes(32).toString("hex");
  const expiresAt    = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  const { error: sessionError } = await supabase.from("invite_sessions").insert({
    session_token: sessionToken,
    email:         email.toLowerCase(),
    invite_id:     invite.id,
    expires_at:    expiresAt,
    used:          false,
  });

  if (sessionError) {
    console.error("[validateInviteToken] session insert error:", sessionError);
    return { success: false, error: "Failed to proceed. Please try again." };
  }

  (await cookies()).set("invite_session", sessionToken, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   15 * 60,
    path:     "/auth/complete-signup",
  });

  return { success: true, sessionToken };
}

// ─── Complete signup ──────────────────────────────────────────────────────────

export type CompleteSignupResult =
  | { success: true;  message: string }
  | { success: false; error: string };

export async function completeSignupAction(
  _prevState: CompleteSignupResult | null,
  formData: FormData
): Promise<CompleteSignupResult> {
  const sessionToken = (await cookies()).get("invite_session")?.value;
  if (!sessionToken) {
    return { success: false, error: "Session expired. Please request a new invitation." };
  }

  const password = (formData.get("password") as string | null)?.trim() ?? "";
  const fullName  = (formData.get("fullName")  as string | null)?.trim() ?? "";
  const email     = (formData.get("email")     as string | null)?.trim().toLowerCase() ?? "";

  if (!password || password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();

  // 1. Validate session
  const { data: session, error: sessionError } = await supabase
    .from("invite_sessions")
    .select("*, pending_invites(id, email, status)")
    .eq("session_token", sessionToken)
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (sessionError) {
    console.error("[completeSignupAction] session lookup error:", sessionError);
    return { success: false, error: "Failed to validate session." };
  }
  if (!session) {
    return { success: false, error: "Invalid or expired session. Please request a new invite." };
  }
  if (session.pending_invites?.status !== "pending") {
    return { success: false, error: "This invitation has already been used." };
  }

  const resolvedEmail = (session.email as string) || email;

  try {
    // 2. Use your existing signup — no admin key needed
    const result = await signup(resolvedEmail, password, fullName || undefined);

    if (!result.success) {
      const msg = (result.error as Error)?.message ?? "Signup failed.";
      console.error("[completeSignupAction] signup error:", msg);
      return { success: false, error: msg };
    }

    // 3. Mark invite as accepted
    await supabase
      .from("pending_invites")
      .update({
        status:      "accepted",
        accepted_at: new Date().toISOString(),
        updated_at:  new Date().toISOString(),
      })
      .eq("id", session.invite_id);

    // 4. Mark session as used
    await supabase
      .from("invite_sessions")
      .update({ used: true })
      .eq("session_token", sessionToken);

    // 5. Clear cookie
    (await cookies()).delete("invite_session");

    return { success: true, message: "Account created! Redirecting…" };

  } catch (err: unknown) {
    const e = err as Error;
    console.error("[completeSignupAction] unexpected error:", e?.message);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}