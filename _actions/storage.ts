'use server';

import { createClient } from "@/lib/supabase/server"

export type UploadResult =
  | { success: true;  url: string }
  | { success: false; error: string }

export async function uploadTeamMemberImage(file: File): Promise<UploadResult> {
  const supabase = await createClient()

  // sanitise filename — remove spaces, add timestamp to avoid collisions
  const ext      = file.name.split(".").pop()?.toLowerCase() ?? "jpg"
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const path     = `team-members/${filename}`

  const { error: uploadError } = await supabase.storage
    .from("media")          
    .upload(path, file, {
      cacheControl: "3600",
      upsert:       false,
      contentType:  file.type,
    })

  if (uploadError) {
    return { success: false, error: uploadError.message }
  }

  const { data } = supabase.storage
    .from("media")
    .getPublicUrl(path)

  return { success: true, url: data.publicUrl }
}

export async function uploadProfileAvatar(file: File, profileId: string): Promise<UploadResult> {
  const supabase = await createClient()

  if (!file.type.startsWith("image/")) {
    return { success: false, error: "El avatar debe ser una imagen." }
  }

  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "El avatar no puede superar los 5 MB." }
  }

  const ext      = file.name.split(".").pop()?.toLowerCase() ?? "jpg"
  const filename = `${profileId}-${Date.now()}.${ext}`
  const path     = `${profileId}/${filename}`

  const { error: uploadError } = await supabase.storage
    .from("user_images")
    .upload(path, file, {
      cacheControl: "3600",
      upsert:       true,
    })

  if (uploadError) {
    return { success: false, error: uploadError.message }
  }

  const { data } = supabase.storage
    .from("user_images")
    .getPublicUrl(path)

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: data.publicUrl, updated_at: new Date().toISOString() })
    .eq("id", profileId)

  if (profileError) {
    await supabase.storage.from("user_images").remove([path])
    return { success: false, error: profileError.message }
  }

  return { success: true, url: data.publicUrl }
}

export async function deleteStorageFile(url: string): Promise<void> {
  const supabase = await createClient()

  const marker = "/object/public/media/"
  const idx    = url.indexOf(marker)
  if (idx === -1) return

  const path = url.slice(idx + marker.length)
  await supabase.storage.from("media").remove([path])
}