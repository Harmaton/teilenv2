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
  values?: string[] | null;
  strengths?: string[] | null;
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

export async function getProfileValuesStrengths(): Promise<
  | { success: true; data: { values: string[]; strengths: string[] } }
  | { success: false; error: string }
> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("values, strengths")
    .eq("id", authResult.user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    data: {
      values: Array.isArray(data?.values) ? data.values : [],
      strengths: Array.isArray(data?.strengths) ? data.strengths : [],
    },
  };
}

export async function updateProfileValuesStrengths(
  _prevState: { success: true; message: string } | { success: false; error: string },
  formData: FormData
): Promise<{ success: true; message: string } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error ?? "No se pudo autenticar." };

  const values = formData.getAll("values") as string[];
  const strengths = formData.getAll("strengths") as string[];

  if (values.length > 4 || strengths.length > 4) {
    return { success: false, error: "Máximo 4 valores y 4 fortalezas permitidas." };
  }

  const supabase = await createClient();
  const updates = {
    values: values.length > 0 ? values : null,
    strengths: strengths.length > 0 ? strengths : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("profiles").update(updates).eq("id", authResult.user.id);
  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Valores y fortalezas actualizados correctamente." };
}
