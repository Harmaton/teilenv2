"use client";

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtp } from "@/_actions/auth";

const OTP_LENGTH = 6;

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // only digits

    const newDigits = [...digits];

    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, OTP_LENGTH);
      for (let i = 0; i < OTP_LENGTH; i++) {
        newDigits[i] = pasted[i] ?? "";
      }
      setDigits(newDigits);
      inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
      return;
    }

    newDigits[index] = value;
    setDigits(newDigits);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = useCallback(
    async (otp: string) => {
      if (otp.length !== OTP_LENGTH) return;
      setError("");
      setIsSubmitting(true);

      const result = await verifyOtp(email, otp);
      setIsSubmitting(false);

      if (!result.success) {
        setError(
          (result.error as { message?: string })?.message ??
            "Invalid or expired code. Please try again."
        );
        setDigits(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
        return;
      }

      router.push("/tests");
      router.refresh();
    },
    [email, router]
  );

  // Auto-submit when all digits are filled
  useEffect(() => {
    const otp = digits.join("");
    if (otp.length === OTP_LENGTH) {
      handleVerify(otp);
    }
  }, [digits, handleVerify]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <Link
          href="/signup"
          className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-[#e46a12] transition-colors hover:text-[#141b3c]"
        >
          ← Volver al registro
        </Link>
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#e46a12]">Verificación segura</p>
        <h1 className="text-3xl font-bold tracking-tight text-[#141b3c]">
          Revisa tu correo
        </h1>
        <p className="text-sm leading-relaxed text-[#545c7e]">
          Enviamos un código de 6 dígitos a{" "}
          <span className="font-semibold text-[#141b3c]">
            {email || "tu correo"}
          </span>
          . Escríbelo aquí para continuar.
        </p>
      </div>

      {/* OTP inputs */}
      <div className="flex gap-2 justify-between">
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={OTP_LENGTH}
            value={digits[i]}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={isSubmitting}
            className="h-14 w-12 rounded-xl border border-[#141b3c]/15 bg-white text-center text-xl font-bold text-[#141b3c] outline-none transition focus:border-[#f27a1a] focus:ring-2 focus:ring-[#f27a1a]/20 disabled:opacity-40"
          />
        ))}
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {isSubmitting && (
        <div className="flex items-center justify-center gap-2 text-sm text-[#545c7e]">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Verificando…
        </div>
      )}

      {/* Resend */}
      <div className="text-center text-sm text-[#545c7e]">
        ¿No recibiste el código?{" "}
        {resendCountdown > 0 ? (
          <span className="text-[#545c7e]/70">
            Puedes reenviar en {resendCountdown}s
          </span>
        ) : (
          <button
            onClick={() => setResendCountdown(60)}
            className="font-semibold text-[#e46a12] hover:underline"
          >
            Reenviar código
          </button>
        )}
      </div>
    </div>
  );
}