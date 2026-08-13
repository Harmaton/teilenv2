"use client";

import { useState, useRef } from "react";
import { useActionState } from "react";
import { updateProfile } from "@/_actions/profile";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { uploadProfileAvatar } from "@/_actions/storage";

type ProfileFormProps = {
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  is_active: boolean;
  userId: string;
};

type ProfileState =
  | { success: true; message: string }
  | { success: false; error: string };

const initialState: ProfileState = { success: false, error: "" };

export default function ProfileForm({
  email,
  full_name,
  avatar_url,
  role,
  is_active,
  userId,
}: ProfileFormProps) {
  const [state, formAction] = useActionState(updateProfile, initialState);
  const [name, setName] = useState(full_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(avatar_url ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(avatar_url);
  const [uploading, setUploading] = useState(false);
  const [dismissedToast, setDismissedToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toastId = state.success
    ? "profile-success"
    : state.error
    ? `profile-error:${state.error}`
    : null;

  const toast = toastId && toastId !== dismissedToast
    ? {
        type: state.success ? "success" : "error",
        message: state.success ? state.message : state.error,
      }
    : null;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to storage
    setUploading(true);
    const result = await uploadProfileAvatar(file, userId);
    setUploading(false);

    if (result.success) {
      setAvatarUrl(result.url);
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      {toast && (
        <div
          className={`rounded-3xl border px-4 py-3 text-sm shadow-sm transition duration-200 ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-4">
            <span>{toast.message}</span>
            <button
              type="button"
              className="text-sm font-semibold uppercase tracking-[0.24em] text-black/50 hover:text-black"
              onClick={() => setDismissedToast(toastId)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4 rounded-3xl border border-black/[0.08] bg-white p-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-black/50">Cuenta</p>
            <h1 className="text-2xl font-semibold text-black">Tu perfil</h1>
            <p className="text-sm text-black/60">
              Actualiza tu nombre y avatar para personalizar tu perfil en el panel.
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
            <Input id="email" type="email" value={email} readOnly className="cursor-not-allowed bg-black/5" />
            <FieldDescription>Tu correo usado para iniciar sesión.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="full_name">Nombre completo</FieldLabel>
            <Input
              id="full_name"
              name="full_name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nombre Apellido"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="avatar_file">Avatar</FieldLabel>
            <input type="hidden" name="avatar_url" value={avatarUrl} />
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-lg border border-black/[0.08] bg-black/[0.02] px-4 py-2 text-sm font-medium text-black hover:bg-black/[0.04] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Subiendo..." : "Cambiar avatar"}
              </button>
              <input
                ref={fileInputRef}
                id="avatar_file"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <FieldDescription>Selecciona una imagen para tu avatar (JPG, PNG, etc.)</FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Rol</FieldLabel>
            <div className="rounded-lg border border-black/[0.08] bg-black/5 px-3 py-2 text-sm text-black/70">
              {role ?? "Usuario"}
            </div>
          </Field>

          <Field>
            <FieldLabel>Estado</FieldLabel>
            <div className="rounded-lg border border-black/[0.08] bg-black/5 px-3 py-2 text-sm text-black/70">
              {is_active ? "Activo" : "Inactivo"}
            </div>
          </Field>

          <Field className="pt-4">
            <Button
              type="submit"
              className="bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500"
            >
              Guardar cambios
            </Button>
          </Field>
        </div>

        <div className="rounded-3xl border border-black/[0.08] bg-white p-6">
          <div className="mb-6 flex justify-center">
            <div className="relative h-40 w-40 overflow-hidden rounded-full bg-black/5">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar preview"
                  fill
                  sizes="160px"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl font-semibold text-black/35">
                  {name ? name[0].toUpperCase() : "U"}
                </div>
              )}
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-black">Vista previa del avatar</p>
            <p className="text-sm text-black/60">Se actualiza cuando subes una imagen.</p>
          </div>

          <div className="mt-6 space-y-4 rounded-3xl border border-black/[0.06] bg-black/[0.03] p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-black/40">Consejos</p>
            </div>
            <div className="space-y-3 text-sm text-black/70">
              <p>Usa tu nombre real para que el panel sea más fácil de reconocer.</p>
              <p>El avatar se sube a Supabase Storage automáticamente.</p>
              <p>El rol se mantiene en el backend; contacta al administrador para cambios de permisos.</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}