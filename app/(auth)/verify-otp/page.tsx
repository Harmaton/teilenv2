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

      router.push("/dashboard");
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
          className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600 mb-4 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          Check your email
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {email || "your email"}
          </span>
          . Enter it below.
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
            className="w-12 h-14 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-center text-xl font-semibold text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition disabled:opacity-40"
          />
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {isSubmitting && (
        <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Verifying…
        </div>
      )}

      {/* Resend */}
      <div className="text-center text-xs text-zinc-500 dark:text-zinc-400">
        Didn&apos;t receive a code?{" "}
        {resendCountdown > 0 ? (
          <span className="text-zinc-400 dark:text-zinc-600">
            Resend in {resendCountdown}s
          </span>
        ) : (
          <button
            onClick={() => setResendCountdown(60)}
            className="font-medium text-zinc-900 dark:text-white hover:underline"
          >
            Resend
          </button>
        )}
      </div>
    </div>
  );
}