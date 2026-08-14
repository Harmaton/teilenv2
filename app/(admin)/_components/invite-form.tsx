
"use client";

import { useState, useTransition } from "react";
import { createInvite } from "@/_actions/admin-users";

const ACCENT = "#FF5A1F";
const ROLES = ["viewer", "author", "editor", "admin"] as const;

export function InviteForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<(typeof ROLES)[number]>("viewer");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await createInvite(email, role);
      if (result.success) {
        setMessage({
          type: "success",
          text: `Invitación enviada a ${result.data.email} — código ${result.data.code}`,
        });
        setEmail("");
      } else {
        setMessage({ type: "error", text: result.error });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-black/[0.06] bg-white p-5">
      <h2 className="mb-4 text-[13px] font-semibold text-black">Invitar usuario</h2>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-[12px] text-black/50">
          Correo
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="persona@empresa.com"
            className="mt-1 w-full rounded-lg border border-black/[0.1] px-3 py-2 text-[13px] text-black outline-none focus:border-black/30"
          />
        </label>
        <label className="text-[12px] text-black/50">
          Rol
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as (typeof ROLES)[number])}
            className="mt-1 block w-full rounded-lg border border-black/[0.1] px-3 py-2 text-[13px] text-black outline-none focus:border-black/30 sm:w-auto"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg px-4 py-2 text-[13px] font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: ACCENT }}
        >
          {isPending ? "Enviando…" : "Enviar invitación"}
        </button>
      </div>
      {message && (
        <p className={`mt-3 text-[12.5px] ${message.type === "success" ? "text-emerald-700" : "text-red-600"}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}