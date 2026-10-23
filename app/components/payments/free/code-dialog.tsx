"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, KeyRound, Loader2 } from "lucide-react";
import { UseUnlock } from "@/_actions/code-access";


type Props = {
  reportId?: string; // optional: pass to unlock a specific report
  onSuccess?: () => void;
};

export function CodeDialog({ reportId, onSuccess }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCode(event.target.value.toUpperCase());
    setMessage("");
    setIsError(false);
  }

  async function handleUnlock() {
    try {
      setLoading(true);
      setMessage("");
      const result = await UseUnlock(code, reportId);

      if (result.success) {
        setMessage(result.message ?? "Código aplicado correctamente");
        setIsError(false);
        onSuccess?.();
        setTimeout(() => {
          setIsOpen(false);
          setCode("");
          router.refresh();
        }, 1800);
      } else {
        setMessage(result.error);
        setIsError(true);
      }
    } catch {
      setMessage("Error al procesar el código");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className="flex w-full items-center justify-center rounded-xl border border-dashed border-[#f27a1a]/40 bg-[#fff8f2] py-3 text-sm font-semibold text-[#141b3c] shadow-sm transition-all hover:bg-[#fff3cf] hover:shadow"
      >
          <KeyRound className="mr-2 h-4 w-4 text-[#e46a12]" />
          <span>¿Tienes un código de acceso?</span>
      </DialogTrigger>
      <DialogContent className="rounded-[26px] border-[#141b3c]/10 bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-[#141b3c]">
            Ingresa tu código de acceso
          </DialogTitle>
          <DialogDescription className="mt-2 text-center text-[#545c7e]">
            Escribe el código que recibiste para desbloquear el informe.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 rounded-2xl bg-[#f6f5fb] p-4">
          <div className="flex flex-col space-y-4">
            <Label htmlFor="code" className="text-sm font-semibold text-[#141b3c]">
              Código
            </Label>
            <Input
              id="code"
              value={code}
              onChange={handleInputChange}
              placeholder="INGRESE SU CÓDIGO"
              className="rounded-xl border-[#141b3c]/15 bg-white p-3 uppercase tracking-wider focus:border-[#f27a1a] focus:ring-[#f27a1a]/20"
              autoComplete="off"
            />
          </div>
        </div>

        {message && (
          <div
            className={`rounded-xl p-3 text-center ${
              isError
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            <div className="flex justify-center items-center text-sm">
              {isError ? (
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {message}
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            onClick={handleUnlock}
            disabled={!code || loading}
            className={`w-full rounded-xl bg-[#f27a1a] py-3 font-semibold text-[#141b3c] shadow-[3px_3px_0_#141b3c] transition-all hover:bg-[#ff8a2b] ${
              loading ? "opacity-80" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Acceder a mi informe
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}