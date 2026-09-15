"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// =====================================================
// TYPES
// =====================================================
export type AccessCodeRow = {
  id: string;
  code: string;
  description: string | null;
  code_type: "general" | "user_specific";
  assigned_profile_id: string | null;
  assigned_profile_name: string | null;
  assigned_profile_email: string | null;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type RedemptionRow = {
  id: string;
  access_code_id: string;
  code_snapshot: string;
  profile_id: string;
  profile_name: string | null;
  profile_email: string | null;
  report_id: string | null;
  test_id: string | null;
  redeemed_at: string;
};

export type ActionResult<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

// =====================================================
// USER: Redeem a code
// =====================================================
export async function UseUnlock(
  code: string,
  reportId?: string
): Promise<ActionResult<{ redemption_id: string; code_id: string }>> {
  try {
    const authResult = await getAuthUser();
    if (!authResult.success) {
      return { success: false, error: "Debes iniciar sesión para usar un código" };
    }

    const trimmed = code?.trim();
    if (!trimmed) {
      return { success: false, error: "Por favor ingresa un código" };
    }

    const supabase = await createClient();

    const { data, error } = await supabase.rpc("redeem_access_code", {
      p_code: trimmed,
      p_profile_id: authResult.user.id,
      p_report_id: reportId ?? null,
    });

    if (error) {
      console.error("redeem_access_code RPC error:", error);
      return { success: false, error: "Error al procesar el código" };
    }

    const result = data as {
      success: boolean;
      error?: string;
      message?: string;
      code_id?: string;
      redemption_id?: string;
    };

    if (!result.success) {
      return { success: false, error: result.error ?? "Código inválido" };
    }

    revalidatePath("/reports");
    if (reportId) revalidatePath(`/reports/${reportId}`);

    return {
      success: true,
      message: result.message ?? "Código aplicado correctamente",
      data: {
        redemption_id: result.redemption_id!,
        code_id: result.code_id!,
      },
    };
  } catch (err) {
    console.error("UseUnlock error:", err);
    return { success: false, error: "Error inesperado al procesar el código" };
  }
}

// =====================================================
// ADMIN: Create an access code
// =====================================================
export async function createAccessCode(input: {
  code: string;
  description?: string;
  codeType: "general" | "user_specific";
  assignedProfileId?: string | null;
  maxUses?: number | null;
  expiresAt?: string | null;
}): Promise<ActionResult<{ id: string; code: string }>> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  // Admin check
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authResult.user.id)
    .single();

  if (!profile || !["super_admin", "admin"].includes(profile.role)) {
    return { success: false, error: "No tienes permisos para crear códigos" };
  }

  const code = input.code?.trim().toUpperCase();
  if (!code) return { success: false, error: "El código es requerido" };
  if (code.length < 4) return { success: false, error: "El código debe tener al menos 4 caracteres" };

  if (input.codeType === "user_specific" && !input.assignedProfileId) {
    return { success: false, error: "Debes seleccionar un usuario para un código específico" };
  }

  const { data, error } = await supabase
    .from("access_codes")
    .insert({
      code,
      description: input.description ?? null,
      code_type: input.codeType,
      assigned_profile_id:
        input.codeType === "user_specific" ? input.assignedProfileId : null,
      max_uses: input.maxUses ?? null,
      expires_at: input.expiresAt ?? null,
      created_by: authResult.user.id,
    })
    .select("id, code")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Ese código ya existe" };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/access-codes");
  return {
    success: true,
    data: { id: data.id, code: data.code },
    message: "Código creado correctamente",
  };
}

// =====================================================
// ADMIN: Toggle active state
// =====================================================
export async function toggleAccessCode(
  codeId: string,
  isActive: boolean
): Promise<ActionResult> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authResult.user.id)
    .single();

  if (!profile || !["super_admin", "admin"].includes(profile.role)) {
    return { success: false, error: "No autorizado" };
  }

  const { error } = await supabase
    .from("access_codes")
    .update({ is_active: isActive })
    .eq("id", codeId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/access-codes");
  return { success: true, message: isActive ? "Código activado" : "Código desactivado" };
}

// =====================================================
// ADMIN: Delete a code
// =====================================================
export async function deleteAccessCode(codeId: string): Promise<ActionResult> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authResult.user.id)
    .single();

  if (!profile || !["super_admin", "admin"].includes(profile.role)) {
    return { success: false, error: "No autorizado" };
  }

  const { error } = await supabase.from("access_codes").delete().eq("id", codeId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/access-codes");
  return { success: true, message: "Código eliminado" };
}

// =====================================================
// ADMIN: List all access codes
// =====================================================
export async function listAccessCodes(): Promise<ActionResult<AccessCodeRow[]>> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authResult.user.id)
    .single();

  if (!profile || !["super_admin", "admin"].includes(profile.role)) {
    return { success: false, error: "No autorizado" };
  }

  const { data, error } = await supabase
    .from("access_codes")
    .select(
      `id, code, description, code_type, assigned_profile_id,
       max_uses, current_uses, expires_at, is_active,
       created_by, created_at, updated_at,
       assigned_profile:profiles!access_codes_assigned_profile_id_fkey (
         full_name, email
       )`
    )
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };

  return {
    success: true,
    data: (data ?? []).map((r: any) => ({
      id: r.id,
      code: r.code,
      description: r.description,
      code_type: r.code_type,
      assigned_profile_id: r.assigned_profile_id,
      assigned_profile_name: r.assigned_profile?.full_name ?? null,
      assigned_profile_email: r.assigned_profile?.email ?? null,
      max_uses: r.max_uses,
      current_uses: r.current_uses,
      expires_at: r.expires_at,
      is_active: r.is_active,
      created_by: r.created_by,
      created_at: r.created_at,
      updated_at: r.updated_at,
    })),
  };
}

// =====================================================
// ADMIN: List all redemptions (who used what code)
// =====================================================
export async function listCodeRedemptions(filters?: {
  codeId?: string;
  profileId?: string;
}): Promise<ActionResult<RedemptionRow[]>> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authResult.user.id)
    .single();

  if (!profile || !["super_admin", "admin"].includes(profile.role)) {
    return { success: false, error: "No autorizado" };
  }

  let query = supabase
    .from("access_code_redemptions")
    .select(
      `id, access_code_id, code_snapshot, profile_id,
       report_id, test_id, redeemed_at,
       profile:profiles!access_code_redemptions_profile_id_fkey (
         full_name, email
       )`
    )
    .order("redeemed_at", { ascending: false });

  if (filters?.codeId) query = query.eq("access_code_id", filters.codeId);
  if (filters?.profileId) query = query.eq("profile_id", filters.profileId);

  const { data, error } = await query;
  if (error) return { success: false, error: error.message };

  return {
    success: true,
    data: (data ?? []).map((r: any) => ({
      id: r.id,
      access_code_id: r.access_code_id,
      code_snapshot: r.code_snapshot,
      profile_id: r.profile_id,
      profile_name: r.profile?.full_name ?? null,
      profile_email: r.profile?.email ?? null,
      report_id: r.report_id,
      test_id: r.test_id,
      redeemed_at: r.redeemed_at,
    })),
  };
}

// =====================================================
// ADMIN: Search users to assign a code to
// =====================================================
export async function searchProfiles(query: string): Promise<
  ActionResult<Array<{ id: string; full_name: string | null; email: string | null }>>
> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authResult.user.id)
    .single();

  if (!profile || !["super_admin", "admin"].includes(profile.role)) {
    return { success: false, error: "No autorizado" };
  }

  const q = query.trim();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .or(`email.ilike.%${q}%,full_name.ilike.%${q}%`)
    .limit(10);

  if (error) return { success: false, error: error.message };
  return { success: true, data: data ?? [] };
}