"use client";

import React from "react";
import {
  Brain,
  Zap,
  Target,
  Heart,
  Compass,
  TrendingUp,
  Shield,
  CheckCircle2,
} from "lucide-react";

const ORANGE = "#FF5A1F";
const ORANGE_SOFT = "#FF7A33";
const MIDNIGHT = "#0a0e1a";

const ITEMS = [
  {
    icon: Brain,
    title: "Tu tipo de personalidad, habilidades y fortalezas",
    snippet: "Perfil: híbrido analítico-intuitivo, alto razonamiento verbal...",
  },
  {
    icon: Zap,
    title: "Tu tipo de genio natural, estilo de pensamiento y verdaderas pasiones",
    snippet: "Tipo de genio: pensador sistémico — puntuación de reconocimiento de patrones: 91%...",
  },
  {
    icon: Target,
    title: "Tu superpoder oculto y cómo usarlo en la vida real",
    snippet: "Fortaleza principal: síntesis rápida en situaciones de incertidumbre...",
  },
  {
    icon: Heart,
    title: "Qué te desgasta y qué te da energía, para convertir los desafíos en fortalezas",
    snippet: "Desgaste energético: tareas repetitivas, poca autonomía...",
  },
  {
    icon: Compass,
    title: "Cómo aprender, trabajar y tomar decisiones según tu estilo",
    snippet: "Estilo de decisión: convergente, basado primero en la evidencia...",
  },
  {
    icon: TrendingUp,
    title: "Tu brújula profesional: entornos ideales, áreas de estudio y posibles proyectos",
    snippet: "Campos recomendados: investigación aplicada, estrategia de producto...",
  },
  {
    icon: Shield,
    title: "Riesgos ocultos que pueden sabotear tu talento",
    snippet: "Alerta de riesgo: perfeccionismo bajo presión externa...",
  },
  {
    icon: CheckCircle2,
    title: "Recomendaciones personalizadas para tu crecimiento",
    snippet: "Próximos pasos: 3 ejercicios específicos, 1 arquetipo de mentor...",
  },
] as const;

function ReportCard({
  icon: Icon,
  title,
  snippet,
}: {
  icon: React.ElementType;
  title: string;
  snippet: string;
}) {
  return (
    <div className="group relative">
      {/* second sheet peeking out bottom-right */}
      <div
        className="absolute inset-0 rounded-2xl bg-[#f3ece2] shadow-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
        style={{ transform: "rotate(2.5deg) translate(6px, 8px)" }}
      >
        <p
          className="absolute bottom-3 right-4 max-w-[70%] truncate text-[11px] italic text-black/35"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {snippet}
        </p>
      </div>

      {/* main card */}
      <div className="relative flex h-full flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:-translate-y-1 md:p-6">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: "rgba(255,90,31,0.1)" }}
        >
          <Icon className="h-5 w-5" style={{ color: ORANGE }} strokeWidth={2} />
        </div>

        <p className="text-[15px] font-medium leading-snug text-[#1c1c22] md:text-base">
          {title}
        </p>

        {/* dog-ear fold */}
        <span
          className="pointer-events-none absolute bottom-0 right-0 h-9 w-9 rounded-br-2xl"
          style={{
            background:
              "linear-gradient(135deg, transparent 50%, #efe7da 50%)",
            boxShadow: "-3px -3px 6px rgba(0,0,0,0.08)",
          }}
        />
      </div>
    </div>
  );
}

export default function WhatIsSection() {
  return (
    <section className="relative w-full overflow-hidden border-x border-b border-white/10 bg-[#0a0e1a] px-6 py-20 md:px-10 md:py-28">
      {/* ambient glow, echoes hero */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ backgroundColor: ORANGE }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full opacity-10 blur-[100px]"
        style={{ backgroundColor: "#6C5CE7" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* heading */}
        <div className="mx-auto max-w-3xl text-center">
          {/* <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#FF9A5C]">
            ¿QUÉ ES?
          </span> */}

          <h2 className="mt-4 text-3xl font-semibold leading-[1.15] tracking-tight text-white md:text-5xl">
            ¿Qué es{" "}
            <span style={{ color: ORANGE_SOFT }}>Teilen Teens</span>?
          </h2>

          <p className="mt-4 text-base text-white/50 md:text-lg">
            No es una prueba vocacional más.
          </p>

          <p className="mt-3 text-lg font-medium leading-snug text-transparent bg-clip-text bg-gradient-to-r from-[#8B7CF6] to-[#FF7A33] md:text-xl">
           Un diagnóstico exhaustivo del talento humano, basado en la neurociencia y seis modelos psicológicos validados.
          </p>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/45 md:text-base">
            En tan solo 10 minutos, detectamos cómo funciona tu mente, cuál es tu poder natural, qué te bloquea y qué puedes hacer al respecto.
          </p>
        </div>

        {/* cards */}
        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ITEMS.map((item, i) => (
            <ReportCard key={i} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}