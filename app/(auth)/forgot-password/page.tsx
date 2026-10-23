"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/_actions/auth";


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await forgotPassword(email);
    setIsSubmitting(false);

    if (!result.success) {
      setError(
        (result.error as { message?: string })?.message ??
          "Something went wrong. Please try again."
      );
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto w-full max-w-md rounded-[28px] border border-[#141b3c]/10 bg-white p-8 shadow-[0_24px_70px_-35px_rgba(20,27,60,.28)] sm:p-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff3cf] text-[#e46a12] shadow-inner">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#141b3c]">
              Revisa tu inbox
            </h1>
            <p className="text-sm leading-relaxed text-[#545c7e]">
              Enviamos un enlace para restablecer tu contraseña a{' '}
              <span className="font-semibold text-[#e46a12]">{email}</span>.
              Expira en 1 hora.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex justify-center rounded-2xl bg-[#f27a1a] px-5 py-3 text-sm font-semibold text-[#141b3c] shadow-[3px_3px_0_#141b3c] transition hover:bg-[#ff8a2b]"
          >
            Volver a iniciar sesión
          </Link>
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
          ← Volver a iniciar sesión
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[#141b3c]">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="text-sm leading-relaxed text-[#545c7e]">
          Ingresa tu correo y te enviaremos un enlace para restablecerla.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            className="h-12 rounded-xl border border-[#141b3c]/15 bg-[#f6f5fb] px-4 text-sm text-[#141b3c] placeholder:text-[#545c7e]/55 outline-none transition focus:border-[#f27a1a] focus:ring-2 focus:ring-[#f27a1a]/20"
          />
        </div>

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
              Enviando…
            </span>
          ) : (
            "Enviar enlace de recuperación"
          )}
        </button>
      </form>
    </div>
  );
}