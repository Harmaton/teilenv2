"use client";

import { theme } from "@/lib/theme";
import React, { useEffect, useRef, useState } from "react";

type Stat = {
  prefix?: string;
  value: number;
  decimals?: number;
  suffix: string;
  label: string;
};

const stats: Stat[] = [
  { prefix: "+", value: 1200, suffix: "", label: "Jóvenes activos" },
  { value: 6, suffix: "", label: "Estudios científicos" },
  { value: 10, suffix: " min", label: "Para tu mapa completo" },
  { value: 4.9, decimals: 1, suffix: "★", label: "Satisfacción" },
];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    let raf: number;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // ease-out cubic

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(target * ease(progress));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

function StatItem({ stat, delay }: { stat: Stat; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const current = useCountUp(stat.value, inView);

  const formatted =
    stat.decimals !== undefined
      ? current.toFixed(stat.decimals)
      : Math.round(current).toLocaleString("es-AR");

  return (
    <div
      ref={ref}
      style={{
        textAlign: "center",
        flex: "1 1 130px",
        minWidth: 110,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(8px)",
        transition: `opacity .5s ease ${delay}ms, transform .5s ease ${delay}ms`,
      }}
    >
      <span
        style={{
          fontSize: "clamp(26px, 5vw, 36px)",
          fontWeight: 900,
          color: theme.colors.white,
          lineHeight: 1,
          display: "block",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {stat.prefix}
        {formatted}
        {stat.suffix}
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: ".08em",
          color: "rgba(255,255,255,.85)",
          marginTop: 6,
          textTransform: "uppercase",
          display: "block",
        }}
      >
        {stat.label}
      </span>
    </div>
  );
}

export default function StatsBar() {
  return (
    <div
      style={{
        backgroundColor: theme.colors.orange,
        padding: "36px 0",
        fontFamily: theme.font,
      }}
    >
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "20px 56px",
          flexWrap: "wrap",
        }}
      >
        {stats.map((s, i) => (
          <StatItem key={s.label} stat={s} delay={i * 90} />
        ))}
      </div>
    </div>
  );
}