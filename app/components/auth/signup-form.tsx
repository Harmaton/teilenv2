"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup } from "@/_actions/auth";

function getPasswordStrength(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return 1
  if (score === 2) return 2
  if (score === 3) return 3
  return 4
}

function getPasswordStrengthLabel(strength: number) {
  if (strength <= 1) return "Muy débil"
  if (strength === 2) return "Débil"
  if (strength === 3) return "Media"
  return "Fuerte"
}

export default function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (passwordStrength < 3) {
      setError(
        "La contraseña debe ser más fuerte. Usa mayúsculas, minúsculas, números y símbolos."
      );
      return;
    }

    setIsSubmitting(true);
    const result = await signup(email, password, fullName);
    setIsSubmitting(false);

    if (!result.success) {
      setError(
        (result.error as { message?: string })?.message ?? "El registro falló. Por favor intenta de nuevo."
      );
      return;
    }

    // Pass email to OTP page via search param
    router.push(`/auth/check-email?email=${encodeURIComponent(email)}`);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <Link
          href="/"
          className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-600 mb-4 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
        >
          ← Teilen Teens
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          Crear cuenta
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Recibirás un correo de verificación después de registrarte.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 tracking-wide">
            Nombre completo
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nombre Apellido"
            autoComplete="name"
            className="h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 tracking-wide">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
            autoComplete="email"
            className="h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 tracking-wide">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 caracteres"
              required
              autoComplete="new-password"
              className="h-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 pr-10 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {password.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Fortaleza de la contraseña</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
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
                        ? "bg-amber-400"
                        : "bg-red-400"
                      : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Usa mayúsculas, minúsculas, números y símbolos.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 tracking-wide">
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              className="h-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 pr-10 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 h-11 flex items-center justify-center rounded-lg bg-orange-500 text-white text-sm font-medium tracking-tight transition hover:bg-orange-600 focus-visible:ring-4 focus-visible:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Creando cuenta…
            </span>
          ) : (
            "Crear cuenta"
          )}
        </button>
      </form>

      <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="font-medium text-zinc-900 dark:text-white hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}