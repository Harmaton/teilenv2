"use client";

import { useState } from "react";
import { useActionState } from "react";
import { updateProfileStrengths } from "@/_actions/profile";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const HARDCODED_STRENGTHS = [
  "Adaptabilidad",
  "Comunicación",
  "Resolución de problemas",
  "Trabajo en equipo",
  "Liderazgo",
  "Empatía",
  "Resiliencia",
  "Creatividad",
  "Pensamiento crítico",
  "Gestión del tiempo",
  "Confiabilidad",
  "Iniciativa",
  "Actitud positiva",
  "Habilidades técnicas",
  "Inteligencia emocional",
];

type StrengthsState =
  | { success: true; message: string }
  | { success: false; error: string };

const initialState: StrengthsState = { success: false, error: "" };

export function ProfileStrengths({
  initialStrengths,
}: {
  initialStrengths?: string[];
}) {
  const [state, formAction] = useActionState(updateProfileStrengths, initialState);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>(initialStrengths ?? []);
  const [dismissedToast, setDismissedToast] = useState<string | null>(null);

  const toastId = state.success
    ? "profile-strengths-success"
    : state.error
    ? `profile-strengths-error:${state.error}`
    : null;

  const toast = toastId && toastId !== dismissedToast
    ? {
        type: state.success ? "success" : "error",
        message: state.success ? state.message : state.error,
      }
    : null;

  const toggleStrength = (strength: string) => {
    if (selectedStrengths.includes(strength)) {
      setSelectedStrengths(selectedStrengths.filter((s) => s !== strength));
    } else if (selectedStrengths.length < 4) {
      setSelectedStrengths([...selectedStrengths, strength]);
    }
  };

  const removeStrength = (strength: string) => {
    setSelectedStrengths(selectedStrengths.filter((s) => s !== strength));
  };

  return (
    <form action={formAction} className="space-y-6">
      {toast && (
        <div
          className={`flex items-start justify-between gap-4 rounded-lg border px-4 py-3 text-sm shadow-sm transition duration-200 ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="status"
          aria-live="polite"
        >
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setDismissedToast(toastId)}
            aria-label="Cerrar"
            className="shrink-0 rounded-md p-1 text-current/60 transition-colors hover:bg-black/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-[15px] font-medium text-black/85">Fortalezas</h3>
          <p className="mt-1 text-[13px] text-black/45">
            Selecciona hasta 4 fortalezas tuyas.
          </p>
        </div>

        {selectedStrengths.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {selectedStrengths.map((strength) => (
              <div
                key={strength}
                className="flex items-center justify-between rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 transition-all duration-300 hover:border-blue-300 hover:shadow-[0_4px_16px_-4px_rgba(59,130,246,0.3)]"
              >
                <span className="text-sm font-medium text-black">{strength}</span>
                <button
                  type="button"
                  onClick={() => removeStrength(strength)}
                  aria-label={`Quitar ${strength}`}
                  className="rounded-full p-1 text-blue-400 transition-all duration-200 hover:rotate-90 hover:bg-blue-100 hover:text-blue-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs text-black/40">
            Seleccionados: {selectedStrengths.length}/4
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {HARDCODED_STRENGTHS.map((strength) => (
              <button
                key={strength}
                type="button"
                onClick={() => toggleStrength(strength)}
                disabled={selectedStrengths.length >= 4 && !selectedStrengths.includes(strength)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-40 ${
                  selectedStrengths.includes(strength)
                    ? "border-transparent bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm shadow-blue-500/25"
                    : "border-black/[0.08] bg-white text-black/70 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-gradient-to-br hover:from-orange-50 hover:to-white hover:text-orange-700 hover:shadow-[0_4px_12px_-4px_rgba(249,115,22,0.35)]"
                }`}
              >
                {strength}
              </button>
            ))}
          </div>
        </div>

        {selectedStrengths.map((strength) => (
          <input key={strength} type="hidden" name="strengths" value={strength} />
        ))}
      </div>

      <div className="flex justify-end border-t border-black/[0.08] pt-6">
        <Button
          type="submit"
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-sm shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-700 hover:shadow-md hover:shadow-orange-500/30 active:translate-y-0 focus-visible:ring-orange-500"
        >
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}