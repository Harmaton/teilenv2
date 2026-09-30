"use client";

import { useState } from "react";

/**
 * Excel-style 3D icon: layered sheets, folded corner, green gradient and a
 * embossed "X". Inline SVG so it scales crisply and needs no asset.
 */
export function ExcelIcon({ size = 20 }: { size?: number }) {
  const id = "excel3d";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="shrink-0 drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)]"
    >
      <defs>
        <linearGradient id={`${id}-back`} x1="24" y1="6" x2="24" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2EA96A" />
          <stop offset="1" stopColor="#1D6F45" />
        </linearGradient>
        <linearGradient id={`${id}-front`} x1="24" y1="14" x2="24" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3FCB87" />
          <stop offset="1" stopColor="#217346" />
        </linearGradient>
        <linearGradient id={`${id}-fold`} x1="36" y1="6" x2="44" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9FE9C4" />
          <stop offset="1" stopColor="#63C795" />
        </linearGradient>
      </defs>

      {/* back sheet (offset up-left for depth) */}
      <path
        d="M12 4h18l7 7v22a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        fill={`url(#${id}-back)`}
      />
      <path d="M30 4l7 7h-7V4Z" fill={`url(#${id}-fold)`} opacity="0.85" />

      {/* front sheet */}
      <path
        d="M17 12h15l7 7v21a2 2 0 0 1-2 2H17a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2Z"
        fill={`url(#${id}-front)`}
        stroke="#14532D"
        strokeOpacity="0.35"
      />
      <path d="M32 12l7 7h-7v-7Z" fill={`url(#${id}-fold)`} />

      {/* embossed X */}
      <path
        d="M22.5 22.5 31.5 33.5M31.5 22.5 22.5 33.5"
        stroke="#0F3D22"
        strokeOpacity="0.35"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M22.5 21.5 31.5 32.5M31.5 21.5 22.5 32.5"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ExportUsersButton({ className = "" }: { className?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/users/export", { cache: "no-store" });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `No se pudo exportar (${res.status}).`);
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = /filename="?([^"]+)"?/.exec(disposition);
      const filename = match?.[1] ?? "usuarios-teilen.xlsx";

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Revoke on the next tick so Safari has time to start the download.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleDownload}
        disabled={busy}
        className="group flex items-center gap-2.5 rounded-full bg-gradient-to-b from-[#2EA96A] to-[#1D6F45] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_6px_16px_-6px_rgba(29,111,69,0.8)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#33BC74] hover:to-[#227A4B] hover:shadow-[0_10px_22px_-8px_rgba(29,111,69,0.9)] active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
      >
        <span className="relative">
          <ExcelIcon size={20} />
          {busy && (
            <span className="absolute -inset-1 rounded-full bg-white/40 animate-pulse" />
          )}
        </span>
        {busy ? "Generando Excel…" : "Descargar Excel"}
      </button>

      {error && <p className="mt-1.5 text-[11.5px] text-red-600">{error}</p>}
    </div>
  );
}
