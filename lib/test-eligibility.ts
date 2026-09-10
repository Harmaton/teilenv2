import { createClient } from "@/lib/supabase/server";

export async function getTestProfileEligibility(profileId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profile_details")
    .select("age, city")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) return { eligible: false, error: error.message };

  const age = typeof data?.age === "number" ? data.age : null;
  const city = typeof data?.city === "string" ? data.city.trim() : "";

  if (!age || age < 1 || !city) {
    return {
      eligible: false,
      error: "Antes de comenzar un test, completa tu edad y ciudad en Configuración > Perfil.",
    };
  }

  return { eligible: true as const };
}
