'use client'
import React, { useState } from "react";
import { theme } from "@/lib/theme";
import { useBreakpoint, useFadeIn } from "@/hooks/use-breakpoint";

const testimonials = [
  { quote: "«Fui al test sin saber qué esperar. El reporte me dijo que mi fortaleza era construir conexiones y que aprendía mejor con experiencias sociales. Empecé Trabajo Social y nunca estuve tan segura de algo.»", name: "Micaela", meta: "17 años · Córdoba" },
  { quote: "«Sabía que quería emprender pero no en qué. Teilen me mostró que mi genio está en los sistemas y la organización. Hoy tengo una startup de logística y por primera vez siento que estoy en el lugar correcto.»", name: "Javier", meta: "20 años · Buenos Aires" },
  { quote: "«Dejé Medicina después de leer mi reporte. No porque Teilen me lo dijera, sino porque me aclaró lo que yo ya sabía y no me animaba a decir. Ahora estudio Diseño y me levanto con ganas.»", name: "Sofía", meta: "19 años · Rosario" },
  { quote: "«Tardé 10 años en encontrar esto. Si lo hubiera hecho a los 17, habría ahorrado tiempo, plata y mucha angustia.»", name: "Andrea", meta: "28 años · Mendoza" },
  { quote: "«Mi mamá me lo regaló porque yo no paraba de decir que no sabía para qué servía. El reporte me mostró tres cosas en las que soy buena que yo misma no veía. Cambió cómo me veo.»", name: "Valeria", meta: "15 años · Tucumán" },
  { quote: "«Lo hice en crisis laboral. El reporte me mostró que estaba en el entorno equivocado, no en la carrera equivocada. Cambié de empresa y es como si hubiera encendido una luz.»", name: "Miguel", meta: "25 años · Salta" },
];

function TCard({ t }: { t: (typeof testimonials)[number] }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: theme.colors.white,
        borderRadius: 14,
        padding: "30px 26px",
        boxShadow: hover ? "0 12px 48px rgba(0,0,0,.11)" : "0 2px 24px rgba(0,0,0,.06)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        borderTop: `3px solid ${theme.colors.orange}`,
        transform: hover ? "translateY(-5px)" : "translateY(0)",
        transition: "transform .22s, box-shadow .22s",
      }}
    >
      <div style={{ color: theme.colors.orange, fontSize: 13 }}>★★★★★</div>
      <p style={{ fontSize: 13, color: theme.colors.bodyText, lineHeight: 1.72, fontStyle: "italic", flex: 1 }}>{t.quote}</p>
      <div>
        <div style={{ fontWeight: 700, color: theme.colors.navy, fontSize: 14 }}>{t.name}</div>
        <div style={{ fontSize: 11, color: theme.colors.muted }}>{t.meta}</div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { isTablet } = useBreakpoint();
  const { ref, style: fadeStyle } = useFadeIn<HTMLDivElement>();

  return (
    <section style={{ backgroundColor: theme.colors.grayBg, padding: "96px 0", fontFamily: theme.font }} ref={ref}>
      <div style={{ ...fadeStyle, maxWidth: 1140, margin: "0 auto", padding: "0 32px" }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", color: theme.colors.orange, display: "block", marginBottom: 14 }}>
          Resultados reales
        </span>
        <h2 style={{ fontSize: isTablet ? 28 : 38, fontWeight: 900, color: theme.colors.navy, lineHeight: 1.15, marginBottom: 18 }}>
          Esto es lo que pasa cuando un joven se conoce de verdad.
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "repeat(3, 1fr)", gap: 24, marginTop: 48 }}>
          {testimonials.map((t, i) => (
            <TCard key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}