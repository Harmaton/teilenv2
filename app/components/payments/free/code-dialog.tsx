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
    } catch (error) {
      setMessage("Error al procesar el código");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger >
        <Button
          variant="outline"
          className="flex items-center justify-center w-full py-3 bg-white hover:bg-gray-50 border border-dashed border-gray-300 text-gray-700 transition-all rounded-md shadow-sm hover:shadow"
        >
          <KeyRound className="h-4 w-4 mr-2 text-indigo-600" />
          <span>Utilice el código de descarga gratuito</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-center font-bold text-gray-800">
            Ingrese su código de acceso
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-2">
            Proporcione el código promocional o código de administrador para
            desbloquear su informe completo de forma gratuita.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 p-4 rounded-lg my-4">
          <div className="flex flex-col space-y-4">
            <Label htmlFor="code" className="text-sm font-medium text-gray-700">
              Código de acceso
            </Label>
            <Input
              id="code"
              value={code}
              onChange={handleInputChange}
              placeholder="INGRESE SU CÓDIGO"
              className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase tracking-wider"
              autoComplete="off"
            />
          </div>
        </div>

        {message && (
          <div
            className={`text-center p-3 rounded-md ${
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
            className={`w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium rounded-md transition-all ${
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