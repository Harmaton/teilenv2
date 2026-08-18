'use client'
import React from "react";
import { theme } from "@/lib/theme";
import { useBreakpoint, useFadeIn } from "@/hooks/use-breakpoint";

const benefits = [
  { icon: "📖", title: "Un reporte que pueden leer juntos", desc: "Lenguaje claro, no técnico. Diseñado para que padres e hijos lo analicen en familia y conversen desde un lugar concreto." },
  { icon: "💬", title: "Salomón IA también acompaña a los padres", desc: "El mentor virtual no solo acompaña al joven. Los padres pueden hacer preguntas sobre cómo guiar a sus hijos en esta etapa." },
  { icon: "🎯", title: "La inversión más concreta en el futuro de su hijo", desc: "Menos que una clase particular. Un diagnóstico que su hijo puede usar durante años." },
];

export default function ParentsSection() {
  const { isTablet } = useBreakpoint();
  const { ref, style: fadeStyle } = useFadeIn<HTMLDivElement>();

  return (
    <section style={{ backgroundColor: theme.colors.navy, padding: "96px 0", fontFamily: theme.font }} ref={ref}>
      <div style={{ ...fadeStyle, maxWidth: 1140, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", display: "block", marginBottom: 14 }}>
              Para madres y padres
            </span>
            <h2 style={{ fontSize: isTablet ? 28 : 38, fontWeight: 900, color: theme.colors.white, lineHeight: 1.15, marginBottom: 18 }}>
              La pregunta que más les preocupa ya tiene respuesta.
            </h2>
            <p style={{ fontSize: 22, fontStyle: "italic", color: theme.colors.orange, fontWeight: 700, marginBottom: 18, lineHeight: 1.3 }}>
              «¿Mi hijo sabe para qué es bueno?»
            </p>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.68)", lineHeight: 1.78, marginBottom: 32 }}>
              Teilen Teens no le dice a su hijo qué estudiar. Le muestra quién es — para que pueda
              decidir desde ahí, no por presión, moda o miedo.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {benefits.map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                    backgroundColor: "rgba(255,255,255,.07)",
                    borderRadius: 10,
                    padding: 20,
                    borderLeft: `3px solid ${theme.colors.orange}`,
                  }}
                >
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: theme.colors.white, fontSize: 14, marginBottom: 5 }}>{b.title}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.58)", lineHeight: 1.6 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!isTablet && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src="img/2.png"
                alt="Jóvenes revisando el diagnóstico"
                style={{ height: 480, width: "auto", objectFit: "contain", filter: "drop-shadow(0 20px 60px rgba(0,0,0,.35))" }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}