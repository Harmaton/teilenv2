'use client'
import React from "react";
import { theme } from "@/lib/theme";
import { useBreakpoint, useFadeIn } from "@/hooks/use-breakpoint";

const items = [
  { icon: "🧠", title: "Tu perfil de identidad personal", desc: "Quién sos hoy, cómo pensás y qué te mueve genuinamente." },
  { icon: "💡", title: "Tus fortalezas predominantes", desc: "Las 3 capacidades en las que sos naturalmente superior." },
  { icon: "📚", title: "Tu estilo de aprendizaje", desc: "Cómo procesás la información y tomás decisiones en la vida real." },
  { icon: "🚀", title: "Cuatro caminos de desarrollo", desc: "Formación, profesión del futuro, emprendimiento o entorno laboral ideal." },
  { icon: "⚡", title: "Lo que te frena", desc: "El patrón que más limita tu potencial y cómo empezar a trabajarlo." },
  { icon: "💬", title: "Acceso a Salomón IA", desc: "Tu mentor virtual por WhatsApp para profundizar tu reporte en tiempo real." },
];

export default function PromiseSection() {
  const { isTablet } = useBreakpoint();
  const { ref, style: fadeStyle } = useFadeIn<HTMLDivElement>();

  return (
    <section style={{ backgroundColor: theme.colors.grayBg, padding: "96px 0", fontFamily: theme.font }} ref={ref}>
      <div style={{ ...fadeStyle, maxWidth: 1140, margin: "0 auto", padding: "0 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr",
            gap: 72,
            alignItems: "center",
          }}
        >
          {!isTablet && (
            <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
              <img
                src="img/4.png"
                alt="Joven con su Identidad Evolutiva"
                style={{ height: 520, width: "auto", objectFit: "contain", filter: "drop-shadow(0 24px 60px rgba(0,0,0,.12))" }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: 30,
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: theme.colors.orange,
                  color: theme.colors.white,
                  padding: "12px 24px",
                  borderRadius: 50,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".1em",
                  whiteSpace: "nowrap",
                  boxShadow: "0 8px 30px rgba(224,120,32,.4)",
                }}
              >
                ✓ Tu reporte listo en 10 min
              </span>
            </div>
          )}

          <div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", color: theme.colors.orange, display: "block", marginBottom: 14 }}>
              En 10 minutos, tu Identidad Evolutiva incluye:
            </span>
            <h2 style={{ fontSize: isTablet ? 28 : 38, fontWeight: 900, color: theme.colors.navy, lineHeight: 1.15, marginBottom: 18 }}>
              Un mapa completo de quién sos, cómo funcionás y hacia dónde ir.
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 28 }}>
              {items.map((it, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    backgroundColor: theme.colors.white,
                    borderRadius: 10,
                    padding: "18px 22px",
                    border: "1px solid #f0f0f0",
                    borderLeft: `3px solid ${theme.colors.orange}`,
                  }}
                >
                  <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{it.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: theme.colors.navy, fontSize: 14, marginBottom: 3 }}>{it.title}</div>
                    <div style={{ fontSize: 12, color: theme.colors.muted, lineHeight: 1.55 }}>{it.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}