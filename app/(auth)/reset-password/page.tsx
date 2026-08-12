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
      <div className="mx-auto w-full max-w-md rounded-[2rem] border border-orange-200/20 bg-zinc-950/95 p-8 shadow-[0_35px_80px_-40px_rgba(249,115,22,0.45)] text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/15 text-orange-400 shadow-inner">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Contraseña actualizada
          </h1>
          <p className="text-sm text-zinc-400">
            Te redirigimos para iniciar sesión…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-[2rem] border border-orange-200/20 bg-zinc-950/95 p-8 shadow-[0_35px_80px_-40px_rgba(249,115,22,0.45)]">
      <div className="flex flex-col gap-1">
        <Link
          href="/login"
          className="text-[10px] font-mono tracking-[0.3em] uppercase text-orange-200/80 mb-4 inline-flex items-center gap-2 hover:text-orange-100 transition-colors"
        >
          ← Iniciar sesión
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Restablecer contraseña
        </h1>
        <p className="text-sm text-zinc-400">
          Elige una nueva contraseña para tu cuenta.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400 tracking-wide">
            Nueva contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 caracteres"
            required
            autoComplete="new-password"
            className="h-12 rounded-2xl border border-zinc-800 bg-zinc-950/90 px-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400 tracking-wide">
            Confirmar contraseña
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="new-password"
            className="h-12 rounded-2xl border border-zinc-800 bg-zinc-950/90 px-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition"
          />
        </div>

        {password.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Fortaleza</span>
              <span className="font-semibold text-white">
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
                        ? "bg-emerald-500"
                        : level === 3
                        ? "bg-yellow-400"
                        : "bg-red-400"
                      : "bg-zinc-800"
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-zinc-500">
              Usa mayúsculas, minúsculas, números y símbolos.
            </p>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 h-12 rounded-2xl bg-orange-500 text-white text-sm font-semibold transition hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
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