"use client";

import { useState } from "react";
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

const initialState = { success: false, error: null };

type ProfileFormProps = {
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  is_active: boolean;
};

export default function ProfileForm({
  email,
  full_name,
  avatar_url,
  role,
  is_active,
}: ProfileFormProps) {
  const [state, formAction] = useActionState(updateProfile, initialState);
  const [name, setName] = useState(full_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(avatar_url ?? "");
  const [dismissedToast, setDismissedToast] = useState<string | null>(null);

  const toastId = state.success
    ? "profile-success"
    : state.error
    ? `profile-error:${state.error}`
    : null;

  const toast = toastId && toastId !== dismissedToast
    ? {
        type: state.success ? "success" : "error",
        message: state.success ? "Perfil actualizado correctamente." : state.error ?? "Error inesperado.",
      }
    : null;

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
            <FieldLabel htmlFor="avatar_url">URL del avatar</FieldLabel>
            <Input
              id="avatar_url"
              name="avatar_url"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://..."
            />
            <FieldDescription>
              Añade una URL de avatar para mostrar en tu perfil.
            </FieldDescription>
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

          

          {state.success && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Perfil actualizado correctamente.
            </div>
          )}

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
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-3xl bg-black/5">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Avatar preview"
                  fill
                  sizes="64px"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xl font-semibold text-black/35">
                  {name ? name[0].toUpperCase() : "U"}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-black">Vista previa del avatar</p>
              <p className="text-sm text-black/60">Tu imagen se actualizará cuando guardes cambios.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4 rounded-3xl border border-black/[0.06] bg-black/[0.03] p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-black/40">Consejos</p>
            </div>
            <div className="space-y-3 text-sm text-black/70">
              <p>Usa tu nombre real para que el panel sea más fácil de reconocer.</p>
              <p>Si no tienes avatar, mostramos tus iniciales.</p>
              <p>El rol se mantiene en el backend; contacta al administrador para cambios de permisos.</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
