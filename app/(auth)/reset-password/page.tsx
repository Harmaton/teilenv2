"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/_actions/auth";

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return 1;
  if (score === 2) return 2;
  if (score === 3) return 3;
  return 4;
}

function getPasswordStrengthLabel(strength: number) {
  if (strength <= 1) return "Muy débil";
  if (strength === 2) return "Débil";
  if (strength === 3) return "Media";
  return "Fuerte";
}

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const passwordStrength = getPasswordStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword(password);
    setIsSubmitting(false);

    if (!result.success) {
      setError(
        (result.error as { message?: string })?.message ??
          "No se pudo restablecer la contraseña. Es posible que el enlace haya caducado."
      );
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/login"), 2500);
  }

  if (done) {
    return (
      <div className="mx-auto w-full max-w-md rounded-[28px] border border-[#141b3c]/10 bg-white p-8 text-center shadow-[0_24px_70px_-35px_rgba(20,27,60,.28)] sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff3cf] text-[#e46a12] shadow-inner">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-[#141b3c]">
            Contraseña actualizada
          </h1>
          <p className="text-sm text-[#545c7e]">
            Te redirigimos para iniciar sesión…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-[28px] border border-[#141b3c]/10 bg-white p-8 shadow-[0_24px_70px_-35px_rgba(20,27,60,.28)] sm:p-10">
      <div className="flex flex-col gap-1">
        <Link
          href="/login"
          className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-[#e46a12] transition-colors hover:text-[#141b3c]"
        >
          ← Iniciar sesión
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[#141b3c]">
          Restablecer contraseña
        </h1>
        <p className="text-sm text-[#545c7e]">
          Elige una nueva contraseña para tu cuenta.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#141b3c]">
            Nueva contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 caracteres"
            required
            autoComplete="new-password"
            className="h-12 rounded-xl border border-[#141b3c]/15 bg-[#f6f5fb] px-4 text-sm text-[#141b3c] placeholder:text-[#545c7e]/55 outline-none transition focus:border-[#f27a1a] focus:ring-2 focus:ring-[#f27a1a]/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#141b3c]">
            Confirmar contraseña
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="new-password"
            className="h-12 rounded-xl border border-[#141b3c]/15 bg-[#f6f5fb] px-4 text-sm text-[#141b3c] placeholder:text-[#545c7e]/55 outline-none transition focus:border-[#f27a1a] focus:ring-2 focus:ring-[#f27a1a]/20"
          />
        </div>

        {password.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-[#545c7e]">
              <span>Fortaleza</span>
              <span className="font-semibold text-[#141b3c]">
                {getPasswordStrengthLabel(passwordStrength)}
              </span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    level <= passwordStrength
                      ? level === 4
                        ? "bg-[#f27a1a]"
                        : level === 3
                        ? "bg-[#ffc94d]"
                        : "bg-[#e46a12]"
                      : "bg-[#141b3c]/10"
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-[#545c7e]">
              Usa mayúsculas, minúsculas, números y símbolos.
            </p>
          </div>
        )}

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 h-12 rounded-2xl bg-[#f27a1a] text-sm font-semibold text-[#141b3c] shadow-[4px_4px_0_#141b3c] transition hover:bg-[#ff8a2b] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Actualizando…
            </span>
          ) : (
            "Actualizar contraseña"
          )}
        </button>
      </form>
    </div>
  );
}