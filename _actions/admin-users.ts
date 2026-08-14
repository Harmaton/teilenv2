// Suggested path: app/_actions/admin-users.ts
"use server";

import { randomBytes } from "crypto";
import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";


/* ────────────────────────────────────────────────────────────────────── */
/* Types                                                                  */
/* ────────────────────────────────────────────────────────────────────── */

export type UsersOverview = {
  totalUsers: number;
  byRole: Record<string, number>;
  activeUsers7d: number;
  newUsersThisWeek: number;
  pendingInvites: number;
};

export type UserRow = {
  id: string;
  fullName: string | null;
  email: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastAttemptAt: string | null;
};

export type InviteRow = {
  id: string;
  email: string;
  code: string;
  role: string;
  status: "pending" | "accepted" | "expired" | "revoked";
  createdAt: string;
  expiresAt: string;
};

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

const ROLES = ["admin", "editor", "author", "viewer"] as const;
type Role = (typeof ROLES)[number];

/* ────────────────────────────────────────────────────────────────────── */
/* Helpers                                                                */
/* ────────────────────────────────────────────────────────────────────── */

async function requireAdmin() {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false as const, error: authResult.error };

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authResult.user.id)
    .single();

  if (error) return { success: false as const, error: error.message };
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return { success: false as const, error: "No tienes permisos para ver esta sección." };
  }

  return { success: true as const, supabase, adminId: authResult.user.id };
}

// 8-char, human-friendly code — excludes 0/O and 1/I to avoid ambiguity when typed by hand.
function generateInviteCode(length = 8) {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) code += alphabet[bytes[i] % alphabet.length];
  return code;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Users overview & list                                                  */
/* ────────────────────────────────────────────────────────────────────── */

export async function getUsersOverview(): Promise<ActionResult<UsersOverview>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;
  const { supabase } = auth;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [profilesRes, activeRes, invitesRes] = await Promise.all([
    supabase.from("profiles").select("role, created_at"),
    supabase.from("test_attempts").select("profile_id").gte("created_at", weekAgo.toISOString()),
    supabase.from("invites").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  if (profilesRes.error) return { success: false, error: profilesRes.error.message };
  if (activeRes.error) return { success: false, error: activeRes.error.message };
  if (invitesRes.error) return { success: false, error: invitesRes.error.message };

  const byRole: Record<string, number> = {};
  let newUsersThisWeek = 0;
  for (const p of profilesRes.data ?? []) {
    byRole[p.role] = (byRole[p.role] ?? 0) + 1;
    if (new Date(p.created_at) >= weekAgo) newUsersThisWeek += 1;
  }

  return {
    success: true,
    data: {
      totalUsers: profilesRes.data?.length ?? 0,
      byRole,
      activeUsers7d: new Set((activeRes.data ?? []).map((r) => r.profile_id)).size,
      newUsersThisWeek,
      pendingInvites: invitesRes.count ?? 0,
    },
  };
}

export async function listUsers(): Promise<ActionResult<UserRow[]>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;
  const { supabase } = auth;

  const [profilesRes, attemptsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, role, is_active, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("test_attempts").select("profile_id, created_at"),
  ]);

  if (profilesRes.error) return { success: false, error: profilesRes.error.message };
  if (attemptsRes.error) return { success: false, error: attemptsRes.error.message };

  const lastActivity = new Map<string, string>();
  for (const a of attemptsRes.data ?? []) {
    const prev = lastActivity.get(a.profile_id);
    if (!prev || a.created_at > prev) lastActivity.set(a.profile_id, a.created_at);
  }

  const rows: UserRow[] = (profilesRes.data ?? []).map((p) => ({
    id: p.id,
    fullName: p.full_name,
    email: p.email,
    role: p.role,
    isActive: p.is_active,
    createdAt: p.created_at,
    lastAttemptAt: lastActivity.get(p.id) ?? null,
  }));

  return { success: true, data: rows };
}

/* ────────────────────────────────────────────────────────────────────── */
/* Invites                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

export async function listInvites(): Promise<ActionResult<InviteRow[]>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;
  const { supabase } = auth;

  const { data, error } = await supabase
    .from("invites")
    .select("id, email, code, role, status, created_at, expires_at")
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };

  return {
    success: true,
    data: (data ?? []).map((i) => ({
      id: i.id,
      email: i.email,
      code: i.code,
      role: i.role,
      status: i.status,
      createdAt: i.created_at,
      expiresAt: i.expires_at,
    })),
  };
}

export async function createInvite(email: string, role: Role): Promise<ActionResult<InviteRow>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;
  const { supabase, adminId } = auth;

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail.includes("@")) return { success: false, error: "Correo inválido." };
  if (!ROLES.includes(role)) return { success: false, error: "Rol inválido." };

  let code = generateInviteCode();
  let inserted: any = null;
  let insertError: string | null = null;

  // Retry once on the (rare) chance of a code collision against the unique constraint.
  for (let attempt = 0; attempt < 2 && !inserted; attempt++) {
    const { data, error } = await supabase
      .from("invites")
      .insert({ email: normalizedEmail, code, role, invited_by: adminId })
      .select("id, email, code, role, status, created_at, expires_at")
      .single();

    if (!error) {
      inserted = data;
    } else if (error.code === "23505" && error.message.includes("code")) {
      code = generateInviteCode();
    } else {
      insertError = error.message; // e.g. duplicate pending invite for that email
      break;
    }
  }

  if (insertError) return { success: false, error: insertError };
  if (!inserted) return { success: false, error: "No se pudo crear la invitación." };

  const emailResult = await sendInviteEmail(normalizedEmail, code);
  if (!emailResult.success) {
    // The invite row still exists — surface the failure so the admin can hit "reenviar".
    return { success: false, error: `Invitación creada pero el correo falló: ${emailResult.error}` };
  }

  return {
    success: true,
    data: {
      id: inserted.id,
      email: inserted.email,
      code: inserted.code,
      role: inserted.role,
      status: inserted.status,
      createdAt: inserted.created_at,
      expiresAt: inserted.expires_at,
    },
  };
}

export async function resendInvite(inviteId: string): Promise<ActionResult<null>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;
  const { supabase } = auth;

  const { data: invite, error } = await supabase
    .from("invites")
    .select("email, code, status")
    .eq("id", inviteId)
    .single();

  if (error) return { success: false, error: error.message };
  if (invite.status !== "pending") return { success: false, error: "Esta invitación ya no está pendiente." };

  const emailResult = await sendInviteEmail(invite.email, invite.code);
  if (!emailResult.success) return { success: false, error: emailResult.error };

  return { success: true, data: null };
}

export async function revokeInvite(inviteId: string): Promise<ActionResult<null>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;
  const { supabase } = auth;

  const { error } = await supabase.from("invites").update({ status: "revoked" }).eq("id", inviteId);
  if (error) return { success: false, error: error.message };

  return { success: true, data: null };
}

/* ────────────────────────────────────────────────────────────────────── */
/* Redemption — called, unauthenticated, from the public /join page      */
/* ────────────────────────────────────────────────────────────────────── */

export async function redeemInvite(code: string, password: string): Promise<ActionResult<{ email: string }>> {
  const admin = await createClient();

  const { data: invite, error: inviteError } = await admin
    .from("invites")
    .select("id, email, role, status, expires_at")
    .eq("code", code.trim().toUpperCase())
    .single();

  if (inviteError || !invite) return { success: false, error: "Código de invitación inválido." };
  if (invite.status !== "pending") return { success: false, error: "Esta invitación ya fue usada o revocada." };
  if (new Date(invite.expires_at) < new Date()) {
    await admin.from("invites").update({ status: "expired" }).eq("id", invite.id);
    return { success: false, error: "Esta invitación ha expirado." };
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: invite.email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    return { success: false, error: createError?.message ?? "No se pudo crear la cuenta." };
  }

  // profiles row is created (e.g. via an on-auth-user-created trigger) with the
  // default 'viewer' role — bring it in line with what was actually invited.
  const { error: roleError } = await admin.from("profiles").update({ role: invite.role }).eq("id", created.user.id);
  if (roleError) return { success: false, error: roleError.message };

  await admin
    .from("invites")
    .update({ status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", invite.id);

  return { success: true, data: { email: invite.email } };
}

/* ────────────────────────────────────────────────────────────────────── */
/* Email delivery (Resend — swap the provider here if you use another)   */
/* ────────────────────────────────────────────────────────────────────── */

async function sendInviteEmail(email: string, code: string): Promise<{ success: true } | { success: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { success: false, error: "RESEND_API_KEY no está configurada." };

  const joinUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/join?code=${code}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.INVITE_EMAIL_FROM ?? "onboarding@resend.dev",
      to: email,
      subject: "Te han invitado",
      html: `
        <p>Te han invitado a unirte a la plataforma.</p>
        <p>Tu código de invitación es: <strong style="font-size:18px;letter-spacing:2px;">${code}</strong></p>
        <p>Puedes canjearlo directamente aquí: <a href="${joinUrl}">${joinUrl}</a></p>
        <p>Este código expira en 7 días.</p>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return { success: false, error: `Resend error (${res.status}): ${body}` };
  }

  return { success: true };
}