"use client";

import { useState } from "react";
import { useActionState } from "react";
import { updateUserSettings } from "@/_actions/settings";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";

type SettingsState =
  | { success: true; message: string }
  | { success: false; error: string };

const initialState: SettingsState = { success: false, error: "" };

type SettingsFormProps = {
  theme: "auto" | "light" | "dark";
  emailNotifications: boolean;
  helpTips: boolean;
};

export default function SettingsForm({
  theme: initialTheme,
  emailNotifications: initialEmailNotifications,
  helpTips: initialHelpTips,
}: SettingsFormProps) {
  const [state, formAction] = useActionState(updateUserSettings, initialState);
  const [theme, setTheme] = useState(initialTheme);
  const [emailNotifications, setEmailNotifications] = useState(initialEmailNotifications);
  const [helpTips, setHelpTips] = useState(initialHelpTips);
  const [dismissedToast, setDismissedToast] = useState<string | null>(null);

  const toastId = state.success
    ? "settings-success"
    : state.error
    ? `settings-error:${state.error}`
    : null;

  const toast = toastId && toastId !== dismissedToast
    ? {
        type: state.success ? "success" : "error",
        message: state.success ? state.message : state.error,
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
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-black/50">Preferencias</p>
            <h1 className="text-2xl font-semibold text-black">Configuración del sitio</h1>
            <p className="text-sm text-black/60">
              Ajusta tu tema y notificaciones para una experiencia más personalizada.
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="theme">Tema</FieldLabel>
            <select
              id="theme"
              name="theme"
              value={theme}
              onChange={(event) => setTheme(event.target.value as "auto" | "light" | "dark")}
              className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-black outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="auto">Automático</option>
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
            <FieldDescription>
              Elige cómo quieres ver la interfaz en el panel.
            </FieldDescription>
          </Field>

          <Field>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor="emailNotifications">Correo electrónico</FieldLabel>
              <label className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-black/[0.08] bg-black/5 px-3 py-2 text-sm text-black/70">
                <span>{emailNotifications ? "Activado" : "Desactivado"}</span>
                <input
                  id="emailNotifications"
                  name="emailNotifications"
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(event) => setEmailNotifications(event.target.checked)}
                  className="h-4 w-4 rounded border-border bg-background text-orange-600 focus:ring-orange-500"
                />
              </label>
            </div>
            <FieldDescription>
              Recibe alertas y actualizaciones importantes por correo.
            </FieldDescription>
          </Field>

          <Field>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor="helpTips">Consejos rápidos</FieldLabel>
              <label className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-black/[0.08] bg-black/5 px-3 py-2 text-sm text-black/70">
                <span>{helpTips ? "Visible" : "Oculto"}</span>
                <input
                  id="helpTips"
                  name="helpTips"
                  type="checkbox"
                  checked={helpTips}
                  onChange={(event) => setHelpTips(event.target.checked)}
                  className="h-4 w-4 rounded border-border bg-background text-orange-600 focus:ring-orange-500"
                />
              </label>
            </div>
            <FieldDescription>
              Mostrar sugerencias rápidas dentro del panel cuando uses nuevas funciones.
            </FieldDescription>
          </Field>

          {state.success && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {state.message}
            </div>
          )}

          <Field className="pt-4">
            <Button
              type="submit"
              className="bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500"
            >
              Guardar preferencias
            </Button>
          </Field>
        </div>

        <div className="rounded-3xl border border-black/[0.08] bg-white p-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-black/40">Modo de guardado</p>
              <p className="text-sm text-black/70">
                Los ajustes se aplican de forma inmediata a nivel local y se guardan en tu cuenta.
              </p>
            </div>
            <div className="rounded-3xl border border-black/[0.06] bg-black/[0.03] p-4 text-sm text-black/70">
              <p className="font-semibold text-black">Resumen</p>
              <ul className="mt-3 space-y-2">
                <li>Tema: {theme === "auto" ? "Automático" : theme === "light" ? "Claro" : "Oscuro"}</li>
                <li>Notificaciones por correo: {emailNotifications ? "Sí" : "No"}</li>
                <li>Consejos rápidos: {helpTips ? "Sí" : "No"}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}