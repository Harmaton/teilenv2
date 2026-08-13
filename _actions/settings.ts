"use server";

import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type SitePreferences = {
  theme: "auto" | "light" | "dark";
  emailNotifications: boolean;
  helpTips: boolean;
};

const DEFAULT_SETTINGS: SitePreferences = {
  theme: "auto",
  emailNotifications: true,
  helpTips: true,
};

export async function getUserSettings(): Promise<
  | { success: true; data: SitePreferences }
  | { success: false; error: string }
> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_settings")
    .select("category, value")
    .eq("profile_id", authResult.user.id)
    .eq("key", "site_preferences")
    .single();

  if (error && error.code !== "PGRST116") {
    return { success: false, error: error.message };
  }

  if (!data) {
    return { success: true, data: DEFAULT_SETTINGS };
  }

  return {
    success: true,
    data: {
      theme: data.value?.theme ?? DEFAULT_SETTINGS.theme,
      emailNotifications:
        typeof data.value?.emailNotifications === "boolean"
          ? data.value.emailNotifications
          : DEFAULT_SETTINGS.emailNotifications,
      helpTips:
        typeof data.value?.helpTips === "boolean"
          ? data.value.helpTips
          : DEFAULT_SETTINGS.helpTips,
    },
  };
}

export async function updateUserSettings(
  _prevState: { success: true; message: string } | { success: false; error: string },
  formData: FormData
): Promise<{ success: true; message: string } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) {
    return { success: false, error: authResult.error ?? "No se pudo autenticar." };
  }

  const theme = (formData.get("theme")?.toString() ?? "auto") as "auto" | "light" | "dark";
  const emailNotifications = formData.get("emailNotifications") === "on";
  const helpTips = formData.get("helpTips") === "on";

  const supabase = await createClient();
  const payload = {
    profile_id: authResult.user.id,
    key: "site_preferences",
    category: "site_preferences",
    value: {
      theme,
      emailNotifications,
      helpTips,
    },
    updated_at: new Date().toISOString(),
  };

  // Delete existing record if it exists, then insert new one
  await supabase
    .from("user_settings")
    .delete()
    .eq("profile_id", authResult.user.id)
    .eq("key", "site_preferences");

  const { error } = await supabase
    .from("user_settings")
    .insert(payload);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Preferencias guardadas correctamente." };
}
