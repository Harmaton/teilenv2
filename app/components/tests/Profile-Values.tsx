"use client";

import { useState } from "react";
import { useActionState } from "react";
import { updateProfileValues } from "@/_actions/profile";
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

type ValuesState =
  | { success: true; message: string }
  | { success: false; error: string };

const initialState: ValuesState = { success: false, error: "" };

export function ProfileValues({
  initialValues,
}: {
  initialValues?: string[];
}) {
  const [state, formAction] = useActionState(updateProfileValues, initialState);
  const [selectedValues, setSelectedValues] = useState<string[]>(initialValues ?? []);
  const [dismissedToast, setDismissedToast] = useState<string | null>(null);

  const toastId = state.success
    ? "profile-values-success"
    : state.error
    ? `profile-values-error:${state.error}`
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

  const removeValue = (value: string) => {
    setSelectedValues(selectedValues.filter((v) => v !== value));
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
          <h3 className="text-[15px] font-medium text-black/85">Valores</h3>
          <p className="mt-1 text-[13px] text-black/45">
            Selecciona hasta 4 valores que te definen.
          </p>
        </div>

        {selectedValues.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {selectedValues.map((value) => (
              <div
                key={value}
                className="flex items-center justify-between rounded-lg border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 transition-all duration-300 hover:border-orange-300 hover:shadow-[0_4px_16px_-4px_rgba(249,115,22,0.3)]"
              >
                <span className="text-sm font-medium text-black">{value}</span>
                <button
                  type="button"
                  onClick={() => removeValue(value)}
                  aria-label={`Quitar ${value}`}
                  className="rounded-full p-1 text-orange-400 transition-all duration-200 hover:rotate-90 hover:bg-orange-100 hover:text-orange-600"
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
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-40 ${
                  selectedValues.includes(value)
                    ? "border-transparent bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-sm shadow-orange-500/25"
                    : "border-black/[0.08] bg-white text-black/70 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-gradient-to-br hover:from-orange-50 hover:to-white hover:text-orange-700 hover:shadow-[0_4px_12px_-4px_rgba(249,115,22,0.35)]"
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