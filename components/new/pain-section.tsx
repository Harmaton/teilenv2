'use client'
import { useBreakpoint, useFadeIn } from "@/hooks/use-breakpoint";
import { theme } from "@/lib/theme";
import React from "react";


const painCards = [
  { emoji: "😰", text: "«No sé qué estudiar. Me gustan mil cosas y ninguna me convence del todo.»" },
  { emoji: "😔", text: "«Tengo miedo de elegir mal y perder años en algo que no era para mí.»" },
  { emoji: "🌀", text: "«¿Y si no tengo ningún talento especial y simplemente no sirvo para nada?»" },
];

export default function PainSection() {
  const { isTablet } = useBreakpoint();
  const { ref, style: fadeStyle } = useFadeIn<HTMLDivElement>();

  return (
    <section style={{ backgroundColor: theme.colors.white, padding: "96px 0", fontFamily: theme.font }} ref={ref}>
      <div style={{ ...fadeStyle, maxWidth: 1140, margin: "0 auto", padding: "0 32px" }}>
        <h2
          style={{
            fontSize: isTablet ? 28 : 36,
            fontWeight: 900,
            color: theme.colors.navy,
            textAlign: "center",
            maxWidth: 680,
            margin: "0 auto 56px",
            lineHeight: 1.2,
          }}
        >
          La mayoría termina el colegio sin saber esto sobre sí mismo.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "repeat(3, 1fr)",
            gap: 28,
            marginBottom: 56,
          }}
        >
          {painCards.map((c, i) => (
            <div
              key={i}
              style={{
                backgroundColor: theme.colors.white,
                borderRadius: 14,
                padding: "36px 28px",
                border: `1px solid ${theme.colors.border}`,
                borderLeft: `4px solid ${theme.colors.orange}`,
              }}
            >
              <span style={{ fontSize: 40, marginBottom: 18, display: "block" }}>{c.emoji}</span>
              <p style={{ fontSize: 15, color: theme.colors.bodyText, fontStyle: "italic", lineHeight: 1.68, fontWeight: 500 }}>
                {c.text}
              </p>
            </div>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            maxWidth: 560,
            margin: "0 auto 48px",
            fontSize: 17,
            color: theme.colors.bodyText,
            lineHeight: 1.78,
          }}
        >
          Esas preguntas no son debilidad. Son la señal de que sos alguien que necesita más que una
          lista de carreras. <strong>Necesitás un mapa real de quién sos.</strong>
        </p>

        <div
          style={{
            backgroundColor: theme.colors.navy,
            borderRadius: 14,
            padding: "52px 40px",
            maxWidth: 580,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 80, fontWeight: 900, color: theme.colors.orange, lineHeight: 1, display: "block", marginBottom: 14 }}>
            7 de cada 10
          </span>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.72)", maxWidth: 320, margin: "0 auto" }}>
            adolescentes elige su camino sin haber identificado sus fortalezas reales.
          </p>
        </div>
      </div>
    </section>
  );
}