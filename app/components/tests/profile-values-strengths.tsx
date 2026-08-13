"use client";

import { useState } from "react";
import { useActionState } from "react";
import { updateProfileValuesStrengths } from "@/_actions/profile";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const HARDCODED_VALUES = [
  "Honestidad",
  "Compasión",
  "Crecimiento",
  "Integridad",
  "Creatividad",
  "Coraje",
  "Sabiduría",
  "Justicia",
  "Templanza",
  "Humildad",
  "Ambición",
  "Excelencia",
  "Paz",
  "Servicio",
  "Liderazgo",
];

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

type ValuesStrengthsState =
  | { success: true; message: string }
  | { success: false; error: string };

const initialState: ValuesStrengthsState = { success: false, error: "" };

export function ProfileValuesStrengths({
  initialValues,
  initialStrengths,
}: {
  initialValues?: string[];
  initialStrengths?: string[];
}) {
  const [state, formAction] = useActionState(updateProfileValuesStrengths, initialState);
  const [selectedValues, setSelectedValues] = useState<string[]>(initialValues ?? []);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>(initialStrengths ?? []);
  const [dismissedToast, setDismissedToast] = useState<string | null>(null);

  const toastId = state.success
    ? "profile-vs-success"
    : state.error
    ? `profile-vs-error:${state.error}`
    : null;

  const toast = toastId && toastId !== dismissedToast
    ? {
        type: state.success ? "success" : "error",
        message: state.success ? state.message : state.error,
      }
    : null;

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else if (selectedValues.length < 4) {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const toggleStrength = (strength: string) => {
    if (selectedStrengths.includes(strength)) {
      setSelectedStrengths(selectedStrengths.filter((s) => s !== strength));
    } else if (selectedStrengths.length < 4) {
      setSelectedStrengths([...selectedStrengths, strength]);
    }
  };

  const removeValue = (value: string) => {
    setSelectedValues(selectedValues.filter((v) => v !== value));
  };

  const removeStrength = (strength: string) => {
    setSelectedStrengths(selectedStrengths.filter((s) => s !== strength));
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

      {/* Values Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-black/50">Valores</h3>
          <p className="mt-1 text-sm text-black/60">Selecciona hasta 4 valores que te definen.</p>
        </div>

        {selectedValues.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {selectedValues.map((value) => (
              <div
                key={value}
                className="flex items-center justify-between rounded-2xl border border-orange-500/30 bg-orange-50 p-4"
              >
                <span className="text-sm font-medium text-black">{value}</span>
                <button
                  type="button"
                  onClick={() => removeValue(value)}
                  className="text-orange-500 hover:text-orange-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs text-black/40">
            Seleccionados: {selectedValues.length}/4
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {HARDCODED_VALUES.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleValue(value)}
                disabled={selectedValues.length >= 4 && !selectedValues.includes(value)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                  selectedValues.includes(value)
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-black/[0.08] bg-white text-black hover:border-black/[0.14] disabled:cursor-not-allowed disabled:opacity-50"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {selectedValues.map((value) => (
          <input key={value} type="hidden" name="values" value={value} />
        ))}
      </div>

      {/* Strengths Section */}
      <div className="space-y-4 border-t border-black/[0.08] pt-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-black/50">Fortalezas</h3>
          <p className="mt-1 text-sm text-black/60">Selecciona hasta 4 fortalezas tuyas.</p>
        </div>

        {selectedStrengths.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {selectedStrengths.map((strength) => (
              <div
                key={strength}
                className="flex items-center justify-between rounded-2xl border border-blue-500/30 bg-blue-50 p-4"
              >
                <span className="text-sm font-medium text-black">{strength}</span>
                <button
                  type="button"
                  onClick={() => removeStrength(strength)}
                  className="text-blue-500 hover:text-blue-600"
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
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                  selectedStrengths.includes(strength)
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-black/[0.08] bg-white text-black hover:border-black/[0.14] disabled:cursor-not-allowed disabled:opacity-50"
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
          className="bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500"
        >
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}