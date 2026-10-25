"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";

export type MinorProfile = {
  id: string;
  fullName: string;
  birthYear: number;
  schoolName: string | null;
  relationship: string;
  avatarUrl: string | null;
};

export type MinorProfileSnapshot = {
  fullName: string;
  birthYear: number;
  schoolName: string | null;
  relationship: string;
  avatarPath: string | null;
};

type ActionResult =
  | { success: true; data: MinorProfile[] }
  | { success: false; error: string };

async function hasSubjectHistory(supabase: Awaited<ReturnType<typeof createClient>>, minorId: string) {
  const [attempts, reports] = await Promise.all([
    supabase.from("test_attempts").select("id").eq("minor_profile_id", minorId).limit(1),
    supabase.from("reports").select("id").eq("minor_profile_id", minorId).limit(1),
  ]);
  if (attempts.error) throw new Error(attempts.error.message);
  if (reports.error) throw new Error(reports.error.message);
  return Boolean(attempts.data.length || reports.data.length);
}

async function hasMatchingImageSignature(file: File) {
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (file.type === "image/jpeg") return header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  if (file.type === "image/png") {
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => header[index] === byte);
  }
  return file.type === "image/webp"
    && header[0] === 0x52
    && header[1] === 0x49
    && header[2] === 0x46
    && header[3] === 0x46
    && header[8] === 0x57
    && header[9] === 0x45
    && header[10] === 0x42
    && header[11] === 0x50;
}

export async function getMinorProfiles(): Promise<ActionResult> {
  const auth = await getAuthUser();
  if (!auth.success) return { success: false, error: auth.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("minor_profiles")
    .select("id, full_name, birth_year, school_name, relationship, avatar_path")
    .eq("guardian_profile_id", auth.user.id)
    .order("created_at", { ascending: true });

  if (error) return { success: false, error: error.message };

  const profiles = await Promise.all(
    data.map(async (profile) => {
      let avatarUrl: string | null = null;
      if (profile.avatar_path) {
        const { data: image, error: imageError } = await supabase.storage
          .from("minor_images")
          .createSignedUrl(profile.avatar_path, 60 * 60);
        if (imageError) {
          console.error("[getMinorProfiles] Could not sign minor image:", imageError.message);
          return null;
        }
        avatarUrl = image.signedUrl;
      }

      return {
        id: profile.id,
        fullName: profile.full_name,
        birthYear: profile.birth_year,
        schoolName: profile.school_name,
        relationship: profile.relationship,
        avatarUrl,
      };
    })
  );

  if (profiles.some((profile) => profile === null)) {
    return { success: false, error: "No se pudieron cargar las imágenes de los perfiles." };
  }

  return {
    success: true,
    data: profiles.filter((profile): profile is MinorProfile => profile !== null),
  };
}

export async function saveMinorProfile(
  formData: FormData
): Promise<{ success: true; data: MinorProfile; warning?: string } | { success: false; error: string }> {
  const auth = await getAuthUser();
  if (!auth.success) return { success: false, error: auth.error };

  const fullName = formData.get("full_name")?.toString().trim() ?? "";
  const relationship = formData.get("relationship")?.toString().trim() ?? "";
  const schoolName = formData.get("school_name")?.toString().trim() ?? "";
  const birthYearValue = formData.get("birth_year")?.toString().trim() ?? "";
  const birthYear = Number(birthYearValue);
  const authorized = formData.get("guardian_authorized") === "on";
  const minorId = formData.get("minor_id")?.toString().trim() ?? "";
  const imageValue = formData.get("image");
  const image = imageValue instanceof File && imageValue.size > 0 ? imageValue : null;

  if (!fullName || !relationship) {
    return { success: false, error: "El nombre y el vínculo con el menor son obligatorios." };
  }
  if (!Number.isInteger(birthYear) || birthYear < 1900 || birthYear > new Date().getFullYear()) {
    return { success: false, error: "Ingresa un año de nacimiento válido." };
  }
  if (fullName.length > 120 || relationship.length > 80 || schoolName.length > 160) {
    return { success: false, error: "Revisa la longitud de los campos e inténtalo de nuevo." };
  }
  if (new Date().getFullYear() - birthYear >= 18) {
    return { success: false, error: "Este perfil es para menores de 18 años. Revisa el año de nacimiento." };
  }
  if (!authorized) {
    return { success: false, error: "Confirma que tienes autorización para registrar estos datos." };
  }
  if (image && (!["image/jpeg", "image/png", "image/webp"].includes(image.type) || image.size > 5 * 1024 * 1024)) {
    return { success: false, error: "La foto debe ser JPG, PNG o WebP y no superar los 5 MB." };
  }
  if (image && !(await hasMatchingImageSignature(image))) {
    return { success: false, error: "El archivo no parece ser una imagen JPG, PNG o WebP válida." };
  }

  const supabase = await createClient();
  let existingPath: string | null = null;
  if (minorId) {
    const { data: existing, error } = await supabase
      .from("minor_profiles")
      .select("id, avatar_path")
      .eq("id", minorId)
      .eq("guardian_profile_id", auth.user.id)
      .single();
    if (error) return { success: false, error: error.message };
    existingPath = existing.avatar_path;
  }

  const id = minorId || randomUUID();
  let uploadedPath: string | null = null;
  if (image) {
    const extension = image.type === "image/jpeg" ? "jpg" : image.type.slice("image/".length);
    uploadedPath = `${auth.user.id}/${id}/${randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("minor_images").upload(uploadedPath, image, {
      cacheControl: "3600",
      contentType: image.type,
      upsert: false,
    });
    if (error) return { success: false, error: error.message };
  }

  const values = {
    guardian_profile_id: auth.user.id,
    full_name: fullName,
    birth_year: birthYear,
    school_name: schoolName || null,
    relationship,
    ...(uploadedPath ? { avatar_path: uploadedPath } : {}),
    authorization_confirmed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const write = minorId
    ? await supabase
        .from("minor_profiles")
        .update(values)
        .eq("id", minorId)
        .eq("guardian_profile_id", auth.user.id)
        .select("id, full_name, birth_year, school_name, relationship, avatar_path")
        .single()
    : await supabase
        .from("minor_profiles")
        .insert({ ...values, id })
        .select("id, full_name, birth_year, school_name, relationship, avatar_path")
        .single();

  if (write.error) {
    if (uploadedPath) {
      const { error: cleanupError } = await supabase.storage.from("minor_images").remove([uploadedPath]);
      if (cleanupError) console.error("[saveMinorProfile] Could not remove failed upload:", cleanupError.message);
    }
    return { success: false, error: write.error.message };
  }

  let warning: string | undefined;
  if (uploadedPath && existingPath) {
    try {
      if (!(await hasSubjectHistory(supabase, id))) {
        const { error: cleanupError } = await supabase.storage.from("minor_images").remove([existingPath]);
        if (cleanupError) {
          console.error("[saveMinorProfile] Could not remove previous image:", cleanupError.message);
          warning = "El perfil se guardó, pero no se pudo eliminar la foto anterior.";
        }
      }
    } catch (cleanupError) {
      console.error("[saveMinorProfile] Could not verify image history:", cleanupError);
      warning = "El perfil se guardó, pero no pudimos verificar si la foto anterior podía eliminarse.";
    }
  }

  const avatarResult = write.data.avatar_path
    ? await supabase.storage.from("minor_images").createSignedUrl(write.data.avatar_path, 60 * 60)
    : null;
  if (avatarResult && (avatarResult.error || !avatarResult.data)) {
    const message = avatarResult.error?.message ?? "No signed URL was returned";
    console.error("[saveMinorProfile] Could not sign saved image:", message);
    warning = "El perfil se guardó, pero no pudimos mostrar su foto.";
  }

  revalidatePath("/dashboard");
  revalidatePath("/tests");
  return {
    success: true,
    warning,
    data: {
      id: write.data.id,
      fullName: write.data.full_name,
      birthYear: write.data.birth_year,
      schoolName: write.data.school_name,
      relationship: write.data.relationship,
      avatarUrl: avatarResult?.data?.signedUrl ?? null,
    },
  };
}

export async function deleteMinorProfile(
  minorId: string
): Promise<{ success: true; warning?: string } | { success: false; error: string }> {
  const auth = await getAuthUser();
  if (!auth.success) return { success: false, error: auth.error };
  if (!minorId) return { success: false, error: "Falta el perfil que quieres eliminar." };

  const supabase = await createClient();
  const { data: profile, error: profileError } = await supabase
    .from("minor_profiles")
    .select("id, avatar_path")
    .eq("id", minorId)
    .eq("guardian_profile_id", auth.user.id)
    .single();
  if (profileError) return { success: false, error: profileError.message };

  let preserveImage = false;
  try {
    preserveImage = await hasSubjectHistory(supabase, minorId);
  } catch (historyError) {
    console.error("[deleteMinorProfile] Could not verify image history:", historyError);
    return { success: false, error: "No pudimos verificar los informes asociados. Inténtalo de nuevo." };
  }

  const { error } = await supabase
    .from("minor_profiles")
    .delete()
    .eq("id", minorId)
    .eq("guardian_profile_id", auth.user.id);
  if (error) return { success: false, error: error.message };

  let warning: string | undefined;
  if (profile.avatar_path && !preserveImage) {
    const { error: imageError } = await supabase.storage.from("minor_images").remove([profile.avatar_path]);
    if (imageError) {
      console.error("[deleteMinorProfile] Could not remove minor image:", imageError.message);
      warning = "El perfil se eliminó, pero no se pudo borrar su foto.";
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/tests");
  return { success: true, warning };
}
