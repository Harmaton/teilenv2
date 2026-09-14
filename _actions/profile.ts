"use server";

import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { pushNotification } from "@/_actions/notifications";

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
  age: number | null;
  city: string | null;
  country: string | null;
};

export async function getUserProfile(): Promise<
  | { success: true; data: ProfileRow }
  | { success: false; error: string }
> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();
  const [{ data, error }, { data: details, error: detailsError }] = await Promise.all([
    supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, role, is_active, created_at, updated_at")
    .eq("id", authResult.user.id)
    .single(),
    supabase
      .from("profile_details")
      .select("age, city, country")
      .eq("profile_id", authResult.user.id)
      .maybeSingle(),
  ]);

  if (error) return { success: false, error: error.message };
  if (detailsError) return { success: false, error: detailsError.message };
  if (!data) return { success: false, error: "Perfil no encontrado." };

  return {
    success: true,
    data: {
      ...data,
      age: details?.age ?? null,
      city: details?.city ?? null,
      country: details?.country ?? null,
    },
  };
}

export async function updateProfile(
  _prevState: { success: true; message: string } | { success: false; error: string },
  formData: FormData
): Promise<{ success: true; message: string } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error ?? "No se pudo autenticar." };

  const full_name = formData.get("full_name")?.toString().trim() ?? "";
  const avatar_url = formData.get("avatar_url")?.toString().trim() ?? "";
  const ageValue = formData.get("age")?.toString().trim() ?? "";
  const city = formData.get("city")?.toString().trim() ?? "";
  const country = formData.get("country")?.toString().trim() ?? "";

  if (!full_name) {
    return { success: false, error: "El nombre completo es obligatorio." };
  }

  const age = Number(ageValue);
  if (!Number.isInteger(age) || age < 1 || age > 120) {
    return { success: false, error: "Ingresa una edad válida." };
  }
  if (!city) {
    return { success: false, error: "La ciudad es obligatoria para realizar tests." };
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

  const { error: detailsError } = await supabase.from("profile_details").upsert({
    profile_id: authResult.user.id,
    age,
    city,
    country: country || null,
  }, { onConflict: "profile_id" });
  if (detailsError) return { success: false, error: detailsError.message };

  await pushNotification({
    profile_id: authResult.user.id,
    title: "Perfil actualizado",
    body: "Tus datos personales están listos para personalizar tus informes.",
    type: "success",
    href: "/settings",
  });

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
