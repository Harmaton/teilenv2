"use client";

import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { redeemInvite } from "@/_actions/admin-users";

const ACCENT = "#FF5A1F";

export default function JoinPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [code, setCode] = useState(params.get("code") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await redeemInvite(code, password);
      if (result.success) {
        router.push("/login?joined=1");
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-1 text-[20px] font-semibold text-black">Únete a la plataforma</h1>
      <p className="mb-6 text-[13px] text-black/45">Introduce tu código de invitación y crea tu contraseña.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="CÓDIGO"
          required
          className="rounded-lg border border-black/[0.1] px-3 py-2 text-[13px] font-mono tracking-widest outline-none focus:border-black/30"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          minLength={8}
          required
          className="rounded-lg border border-black/[0.1] px-3 py-2 text-[13px] outline-none focus:border-black/30"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg px-4 py-2 text-[13px] font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: ACCENT }}
        >
          {isPending ? "Creando cuenta…" : "Crear cuenta"}
        </button>
        {error && <p className="text-[12.5px] text-red-600">{error}</p>}
      </form>
    </div>
  );
}