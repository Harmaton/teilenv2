"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, FileText, Sparkles } from "lucide-react";

const reportSteps = [
  { title: "Mapa de Identidad Evolutiva", detail: "Una visión general de tus capacidades, valores y dirección." },
  { title: "Quién soy hoy", detail: "Una lectura personal, sin reducirte a una etiqueta." },
  { title: "Cómo funciono mejor", detail: "Aprendizaje, capacidades y patrones observables." },
  { title: "Dónde puedo aportar valor", detail: "Escenarios para explorar y contrastar en la vida real." },
  { title: "Mi proyecto de vida", detail: "Preguntas y próximos pasos para seguir descubriendo." },
];

export function AuthPageLayout({
  children,
  imageSrc = "/auth/lgn.png",
  imageAlt = "Mapa ilustrado de posibilidades y desarrollo",
  context = "Tu informe empieza conociéndote",
}: {
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  context?: string;
}) {
  return (
    <div className="grid min-h-svh bg-[#f6f5fb] lg:grid-cols-[minmax(0,0.94fr)_minmax(480px,1.06fr)]">
      <div className="relative flex min-h-svh flex-col px-6 py-6 sm:px-10 sm:py-8 lg:px-14 xl:px-20">
        <Link href="/" className="inline-flex w-fit items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f27a1a]">
          <img src="/assets/teilen-logo.png" alt="" width="46" height="42" className="h-10 w-auto object-contain" />
          <span className="text-sm font-semibold tracking-tight text-[#141b3c]">Teilen <span className="text-[#f27a1a]">Teens</span></span>
        </Link>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[430px]">{children}</div>
        </div>
        <p className="text-center text-xs text-[#545c7e] lg:text-left">Un resultado describe un momento. No define a nadie.</p>
      </div>
      <AuthReportShowcase imageSrc={imageSrc} imageAlt={imageAlt} context={context} />
    </div>
  );
}

function AuthReportShowcase({ imageSrc, imageAlt, context }: { imageSrc: string; imageAlt: string; context: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [typedTitle, setTypedTitle] = useState("");
  const [typedDetail, setTypedDetail] = useState("");

  useEffect(() => {
    const current = reportSteps[activeIndex];
    let active = true;
    let titleIndex = 0;
    let detailIndex = 0;
    let detailTimer: ReturnType<typeof setTimeout> | undefined;
    let textTimer: number | undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const revealTimer = setTimeout(() => {
        if (!active) return;
        setTypedTitle(current.title);
        setTypedDetail(current.detail);
      }, 0);
      const nextTimer = setTimeout(() => {
        if (active) setActiveIndex((index) => (index + 1) % reportSteps.length);
      }, 3200);
      return () => {
        active = false;
        clearTimeout(revealTimer);
        clearTimeout(nextTimer);
      };
    }

    let titleTimer: number | undefined;
    const startTimer = setTimeout(() => {
      if (!active) return;
      setTypedTitle("");
      setTypedDetail("");
      titleTimer = window.setInterval(() => {
        if (!active) {
          if (titleTimer !== undefined) window.clearInterval(titleTimer);
          return;
        }
        titleIndex += 1;
        setTypedTitle(current.title.slice(0, titleIndex));
        if (titleIndex >= current.title.length) {
          if (titleTimer !== undefined) window.clearInterval(titleTimer);
          detailTimer = setTimeout(() => {
            if (!active) return;
            textTimer = window.setInterval(() => {
              if (!active) {
                if (textTimer !== undefined) window.clearInterval(textTimer);
                return;
              }
              detailIndex += 2;
              setTypedDetail(current.detail.slice(0, detailIndex));
              if (detailIndex >= current.detail.length) {
                if (textTimer !== undefined) window.clearInterval(textTimer);
                detailTimer = setTimeout(() => {
                  if (active) setActiveIndex((index) => (index + 1) % reportSteps.length);
                }, 2300);
              }
            }, 22);
          }, 250);
        }
      }, 38);
    }, 0);

    return () => {
      active = false;
      clearTimeout(startTimer);
      if (titleTimer !== undefined) window.clearInterval(titleTimer);
      if (textTimer !== undefined) window.clearInterval(textTimer);
      if (detailTimer) clearTimeout(detailTimer);
    };
  }, [activeIndex]);

  return (
    <aside className="relative hidden min-h-svh overflow-hidden bg-[#141b3c] p-5 lg:block xl:p-7" aria-label="Vista previa del informe">
      <div className="absolute inset-0 overflow-hidden rounded-[30px]">
        <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141b3c]/95 via-[#141b3c]/15 to-[#141b3c]/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,201,77,0.28),transparent_38%)]" />
      </div>
      <div className="relative z-10 flex h-full min-h-[calc(100svh-56px)] flex-col justify-between">
        <div className="flex items-center justify-between text-white/90">
          <span className="rounded-full border border-white/25 bg-[#141b3c]/30 px-4 py-2 text-xs font-medium backdrop-blur-md">{context}</span>
          <span className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#141b3c] shadow-lg"><FileText className="h-4 w-4 text-[#f27a1a]" />5 páginas</span>
        </div>
        <div className="mx-auto w-full max-w-[600px] pb-5">
          <div className="rounded-[26px] border border-white/25 bg-[#141b3c]/75 p-5 text-white shadow-[0_24px_70px_-24px_rgba(0,0,0,.7)] backdrop-blur-xl xl:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#ffc94d] text-[#141b3c]"><Sparkles className="h-5 w-5" /></span>
              <div><p className="text-[11px] uppercase tracking-[.18em] text-white/60">Tu recorrido</p><p className="text-sm font-semibold">Informe de Identidad Evolutiva</p></div>
              <span className="ml-auto text-xs tabular-nums text-white/55">0{activeIndex + 1} / 05</span>
            </div>
            <div className="mb-4 flex gap-1.5" aria-hidden="true">
              {reportSteps.map((step, index) => <span key={step.title} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${index <= activeIndex ? "bg-[#ffc94d]" : "bg-white/20"}`} />)}
            </div>
            <div className="min-h-[98px]" aria-live="polite" aria-atomic="true">
              <h2 className="min-h-8 text-xl font-semibold tracking-tight text-white xl:text-2xl">{typedTitle}<span className="ml-0.5 inline-block h-5 w-px animate-pulse bg-[#ffc94d] align-middle" aria-hidden="true" /></h2>
              <p className="mt-2 min-h-10 text-sm leading-relaxed text-white/75">{typedDetail}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4 text-xs text-white/65">
              <span>Con tus propias respuestas</span><span className="inline-flex items-center gap-1.5 font-medium text-[#ffc94d]">Sigue explorando <ArrowUpRight className="h-3.5 w-3.5" /></span>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-white/70">Tu informe se construye con tus propios resultados.</p>
        </div>
      </div>
    </aside>
  );
}
