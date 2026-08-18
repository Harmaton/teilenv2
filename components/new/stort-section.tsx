'use client'
import React from "react";
import { theme } from "@/lib/theme";
import { useBreakpoint, useFadeIn } from "@/hooks/use-breakpoint";

export default function StorySection() {
  const { isTablet } = useBreakpoint();
  const { ref, style: fadeStyle } = useFadeIn<HTMLDivElement>();

  return (
    <section style={{ backgroundColor: theme.colors.creamBg, padding: "96px 0", fontFamily: theme.font }} ref={ref}>
      <div style={{ ...fadeStyle, maxWidth: 1140, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1.15fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <span
              style={{
                display: "inline-block",
                backgroundColor: theme.colors.orange,
                color: theme.colors.white,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                padding: "6px 16px",
                borderRadius: 50,
                marginBottom: 22,
              }}
            >
              Nuestra historia
            </span>
            <h2 style={{ fontSize: isTablet ? 24 : 32, fontWeight: 900, color: theme.colors.navy, lineHeight: 1.22, marginBottom: 18 }}>
              Nació para ejecutivos.
              <br />
              Evolucionó para cambiar el punto de partida.
            </h2>
            <div style={{ fontSize: 14, color: theme.colors.bodyText, lineHeight: 1.82 }}>
              <p>
                Hace cinco años, Teilen nació como una herramienta de diagnóstico para profesionales y
                equipos ejecutivos en América Latina. Ayudaba a líderes a identificar sus competencias
                blandas, estilos de liderazgo y capacidades de trabajo en equipo. Los resultados eran
                notables.
              </p>
              <p style={{ marginTop: 14 }}>
                Pero algo seguía apareciendo en cada conversación: <em>«Ojalá hubiera sabido esto a los 18»</em>.
                Una y otra vez, ejecutivos con décadas de carrera descubrían a los 35 o 40 lo que podrían
                haber sabido a los 17.
              </p>
              <p style={{ marginTop: 14 }}>
                Ahí nació la pregunta que lo cambió todo: <strong>¿por qué esperar?</strong> ¿Por qué
                trabajar el talento humano cuando ya está en una empresa, cuando podemos hacerlo antes de
                que tome las decisiones que moldean toda una vida?
              </p>
              <p style={{ marginTop: 14 }}>
                Así nació Teilen Teens. No como una versión simplificada del sistema original, sino como
                su evolución más importante: llevar el autoconocimiento al momento en que más importa.
                Cuando todo todavía está por escribirse.
              </p>
            </div>
            <a
              href="https://paralaje.site"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: 28,
                color: theme.colors.orange,
                fontWeight: 700,
                fontSize: 14,
                borderBottom: `2px solid ${theme.colors.orange}`,
                paddingBottom: 3,
                textDecoration: "none",
              }}
            >
              Conocé PARALAJE, el siguiente paso →
            </a>
          </div>

          {!isTablet && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
              <div
                style={{
                  width: 280,
                  height: 280,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `4px solid ${theme.colors.orange}`,
                  boxShadow: "0 16px 56px rgba(224,120,32,.25)",
                  backgroundColor: theme.colors.grayBg,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <img
                  src="img/5.png"
                  alt="Joven con propósito"
                  style={{ height: "100%", width: "auto", objectFit: "cover", objectPosition: "top center" }}
                />
              </div>
              <div style={{ width: "100%", borderRadius: 16, overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,.1)" }}>
                <img
                  src="img/3.png"
                  alt="Jóvenes estudiando"
                  style={{ width: "100%", height: 200, objectFit: "cover", objectPosition: "top center" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}