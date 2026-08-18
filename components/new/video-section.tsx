'use client'
import React from "react";
import { theme } from "@/lib/theme";
import { useBreakpoint, useFadeIn } from "@/hooks/use-breakpoint";


export default function VideoSection() {
  const { isTablet } = useBreakpoint();
  const { ref, style: fadeStyle } = useFadeIn<HTMLDivElement>();

  return (
    <section style={{ backgroundColor: theme.colors.navy, padding: "96px 0", fontFamily: theme.font }} ref={ref}>
      <div style={{ ...fadeStyle, maxWidth: 1140, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", display: "block", marginBottom: 14 }}>
              Lo que dicen quienes ya lo hicieron
            </span>
            <h2 style={{ fontSize: isTablet ? 26 : 34, fontWeight: 800, color: theme.colors.white, lineHeight: 1.25, marginBottom: 18 }}>
              Escuchá a alguien que pasó exactamente por lo que vos estás viviendo.
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.65)", lineHeight: 1.78, marginBottom: 32 }}>
              No es un adulto explicándote qué hacer. Es alguien de tu edad contándote qué cambió
              cuando finalmente pudo ver quién era. Mirá el video y después hacé tu propio diagnóstico.
            </p>
            <a
              href="/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: theme.colors.white,
                color: theme.colors.navy,
                padding: "17px 34px",
                borderRadius: 50,
                fontFamily: theme.font,
                fontWeight: 700,
                fontSize: 14,
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              → Hacer mi diagnóstico ahora
            </a>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                position: "relative",
                borderRadius: 22,
                overflow: "hidden",
                boxShadow: "0 32px 80px rgba(0,0,0,.5)",
                aspectRatio: "9 / 16",
                maxHeight: 560,
                width: "100%",
                maxWidth: 315,
                border: "2px solid rgba(224,120,32,.35)",
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/9-6X6oHT4-s"
                title="Teilen Teens"
                allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}