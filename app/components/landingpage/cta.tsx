"use client";

import React from "react";
import { ArrowRight, PlayCircle } from "lucide-react";

const ORANGE = "#FF5A1F";

export default function CtaSection() {
  return (
    <section className="relative w-full overflow-hidden border-x border-b border-white/10 bg-[#0a0e1a] px-6 py-20 md:px-10 md:py-28">
      {/* ambient glow, consistent with hero/sections above */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ backgroundColor: ORANGE }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 h-[260px] w-[260px] rounded-full opacity-10 blur-[100px]"
        style={{ backgroundColor: "#6C5CE7" }}
      />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#FF9A5C]">
          Listo cuando estés
        </span>

        <h2 className="mt-4 text-3xl font-semibold leading-[1.15] tracking-tight text-white md:text-5xl">
         Tu talento está esperando ser descubierto.{" "}
          <span className="text-[#FF7A33]">llamado</span>.
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/50 md:text-base">
          Solo se necesitan 10 minutos para ver lo que ha estado ahí todo este tiempo.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          
          <a
          href="/login"
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[15px] font-medium text-black transition-opacity hover:opacity-90"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-400">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#111" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#111" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#111" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#111" />
            </svg>
          </span>
          Prueba el diagnóstico
        </a>

          
           <a href="#"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-7 py-3.5 text-[15px] font-medium text-white/80 backdrop-blur-sm transition-colors duration-200 hover:border-white/25 hover:text-white"
          >
            <PlayCircle className="h-4 w-4" />
            Ver cómo funciona
          </a>
        </div>
      </div>
    </section>
  );
}