"use server";

import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export async function getUserProfile(): Promise<
  | { success: true; data: ProfileRow }
  | { success: false; error: string }
> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, role, is_active, created_at, updated_at")
    .eq("id", authResult.user.id)
    .single();

  if (error) return { success: false, error: error.message };
  if (!data) return { success: false, error: "Perfil no encontrado." };

  return { success: true, data };
}

export async function updateProfile(
  _prevState: { success: true; message: string } | { success: false; error: string },
  formData: FormData
): Promise<{ success: true; message: string } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error ?? "No se pudo autenticar." };

  const full_name = formData.get("full_name")?.toString().trim() ?? "";
  const avatar_url = formData.get("avatar_url")?.toString().trim() ?? "";

  if (!full_name) {
    return { success: false, error: "El nombre completo es obligatorio." };
  }

  const supabase = await createClient();
  const updates = {
    full_name,
    avatar_url: avatar_url || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("profiles").update(updates).eq("id", authResult.user.id);
  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Perfil actualizado correctamente." };
}
