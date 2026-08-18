'use client'
import React from "react";
import { theme } from "@/lib/theme";
import { useBreakpoint, useFadeIn } from "@/hooks/use-breakpoint";

const rows = [
  { label: "Profundidad del análisis", free: "Resultados genéricos", classic: "Listas de carreras", teilen: "Identidad completa y personalizada" },
  { label: "Tiempo de resultado", free: "Inmediato pero superficial", classic: "Sesiones múltiples (costosas)", teilen: "Reporte completo en 10 min" },
  { label: "Orientación vocacional", free: "✕ No incluida", classic: "Básica", teilen: "4 caminos concretos" },
  { label: "Análisis emocional", free: "✕ No", classic: "✕ Rara vez", teilen: "Incluido" },
  { label: "Mentor de seguimiento", free: "✕ No", classic: "Depende del profesional", teilen: "Salomón IA por WhatsApp" },
];

export default function CompareSection() {
  const { isTablet } = useBreakpoint();
  const { ref, style: fadeStyle } = useFadeIn<HTMLDivElement>();

  const thBase: React.CSSProperties = {
    padding: "18px 22px",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: ".05em",
    textTransform: "uppercase",
    textAlign: "center",
  };
  const tdBase: React.CSSProperties = {
    padding: "15px 22px",
    fontSize: 13,
    borderBottom: "1px solid #f0f0f0",
    verticalAlign: "middle",
    color: theme.colors.bodyText,
  };

  return (
    <section style={{ backgroundColor: theme.colors.white, padding: "96px 0", fontFamily: theme.font }} ref={ref}>
      <div style={{ ...fadeStyle, maxWidth: 1140, margin: "0 auto", padding: "0 32px" }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", color: theme.colors.orange, display: "block", marginBottom: 14 }}>
          Por qué Teilen y no otro test
        </span>
        <h2 style={{ fontSize: isTablet ? 28 : 38, fontWeight: 900, color: theme.colors.navy, lineHeight: 1.15, marginBottom: 18 }}>
          No es un test de personalidad.
          <br />
          No es orientación vocacional.
        </h2>
        <p style={{ fontSize: 16, color: theme.colors.muted, lineHeight: 1.75, maxWidth: 620, marginBottom: 44 }}>
          Es la primera plataforma en español que integra identidad, habilidades, emociones y
          orientación en un solo mapa personalizado.
        </p>

        <div style={{ overflowX: "auto", marginTop: 48, borderRadius: 14, boxShadow: "0 4px 48px rgba(0,0,0,.09)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 580 }}>
            <thead>
              <tr>
                <th style={{ ...thBase, textAlign: "left", backgroundColor: theme.colors.navy, color: theme.colors.white }}>
                  ¿Qué analizan?
                </th>
                <th style={{ ...thBase, backgroundColor: theme.colors.grayBg, color: theme.colors.muted }}>Tests gratuitos</th>
                <th style={{ ...thBase, backgroundColor: theme.colors.grayBg, color: theme.colors.muted }}>
                  Orientación vocacional clásica
                </th>
                <th style={{ ...thBase, backgroundColor: theme.colors.orange, color: theme.colors.white }}>✦ Teilen Teens</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...tdBase, fontWeight: 600, color: theme.colors.navy, backgroundColor: "#fafafa" }}>{r.label}</td>
                  <td style={{ ...tdBase, textAlign: "center", color: theme.colors.muted }}>{r.free}</td>
                  <td style={{ ...tdBase, textAlign: "center", color: theme.colors.muted }}>{r.classic}</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: "center",
                      backgroundColor: "rgba(224,120,32,.04)",
                      fontWeight: 600,
                      color: theme.colors.navy,
                    }}
                  >
                    <span style={{ color: theme.colors.orange, fontSize: 16 }}>✓</span> {r.teilen}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}