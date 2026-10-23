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
  const [isSubmitting, setIsSubmitting] = useState(false)
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

    if (result.success) {
      router.push(`/auth/check-email?email=${encodeURIComponent(email)}`);
    }
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-1">
        <Link
          href="/"
          className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-[#e46a12] transition-colors hover:text-[#141b3c]"
        >
          ← Teilen Teens
        </Link>
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#e46a12]">Tu recorrido empieza aquí</p>
        <h1 className="text-3xl font-bold tracking-tight text-[#141b3c]">
          Crear cuenta
        </h1>
        <p className="text-sm leading-relaxed text-[#545c7e]">
          Recibirás un correo de verificación después de registrarte.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#141b3c]">
            Nombre completo
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nombre Apellido"
            autoComplete="name"
            className="h-12 rounded-xl border border-[#141b3c]/15 bg-white px-4 text-sm text-[#141b3c] placeholder:text-[#545c7e]/55 outline-none transition focus:border-[#f27a1a] focus:ring-2 focus:ring-[#f27a1a]/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#141b3c]">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
            autoComplete="email"
            className="h-12 rounded-xl border border-[#141b3c]/15 bg-white px-4 text-sm text-[#141b3c] placeholder:text-[#545c7e]/55 outline-none transition focus:border-[#f27a1a] focus:ring-2 focus:ring-[#f27a1a]/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#141b3c]">
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
              className="h-12 w-full rounded-xl border border-[#141b3c]/15 bg-white px-4 pr-11 text-sm text-[#141b3c] placeholder:text-[#545c7e]/55 outline-none transition focus:border-[#f27a1a] focus:ring-2 focus:ring-[#f27a1a]/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#545c7e] hover:bg-[#f6f5fb] hover:text-[#141b3c]"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {password.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-[#545c7e]">
              <span>Fortaleza de la contraseña</span>
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
                        ? "bg-emerald-500"
                        : level === 3
                        ? "bg-amber-400"
                        : "bg-red-400"
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

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#141b3c]">
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
              className="h-12 w-full rounded-xl border border-[#141b3c]/15 bg-white px-4 pr-11 text-sm text-[#141b3c] placeholder:text-[#545c7e]/55 outline-none transition focus:border-[#f27a1a] focus:ring-2 focus:ring-[#f27a1a]/20"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#545c7e] hover:bg-[#f6f5fb] hover:text-[#141b3c]"
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 flex h-12 items-center justify-center rounded-2xl bg-[#f27a1a] text-sm font-semibold tracking-tight text-[#141b3c] shadow-[4px_4px_0_#141b3c] transition hover:bg-[#ff8a2b] focus-visible:ring-4 focus-visible:ring-[#ffc94d] disabled:cursor-not-allowed disabled:opacity-50"
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

      <p className="text-center text-sm text-[#545c7e]">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#e46a12] hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}