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
      <div className="mx-auto w-full max-w-md rounded-[2rem] border border-orange-200/20 bg-zinc-950/95 p-8 shadow-[0_35px_80px_-40px_rgba(249,115,22,0.45)]">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/15 text-orange-400 shadow-inner">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Revisa tu inbox
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Enviamos un enlace para restablecer tu contraseña a{' '}
              <span className="font-medium text-orange-300">{email}</span>.
              Expira en 1 hora.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex justify-center rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-200 transition hover:bg-orange-500/15"
          >
            Volver a iniciar sesión
          </Link>
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
          ← Volver a iniciar sesión
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Ingresa tu correo y te enviaremos un enlace para restablecerla.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400 tracking-wide">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
            autoComplete="email"
            className="h-12 rounded-2xl border border-zinc-800 bg-zinc-950/90 px-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition"
          />
        </div>

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
              Sending…
            </span>
          ) : (
            "Send reset link"
          )}
        </button>
      </form>
    </div>
  );
}