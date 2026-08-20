'use client'
import React, { useEffect, useRef } from "react";
import { theme } from "@/lib/theme";
import { useBreakpoint, useFadeIn } from "@/hooks/use-breakpoint";

const benefits = [
  { icon: "📖", title: "Un reporte que pueden leer juntos", desc: "Lenguaje claro, no técnico. Diseñado para que padres e hijos lo analicen en familia y conversen desde un lugar concreto." },
  { icon: "💬", title: "Salomón IA también acompaña a los padres", desc: "El mentor virtual no solo acompaña al joven. Los padres pueden hacer preguntas sobre cómo guiar a sus hijos en esta etapa." },
  { icon: "🎯", title: "La inversión más concreta en el futuro de su hijo", desc: "Menos que una clase particular. Un diagnóstico que su hijo puede usar durante años." },
];

export default function ParentsSection() {
  const { isTablet, isMobile } = useBreakpoint();
  const { ref, style: fadeStyle } = useFadeIn<HTMLDivElement>();
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Gentle breathing float on the hero image so it feels alive, not pasted on.
  useEffect(() => {
    let tween: { kill: () => void } | undefined;

    (async () => {
      const gsapModule = await import("gsap");
      const gsap = gsapModule.gsap ?? gsapModule.default;
      if (!imgRef.current) return;

      tween = gsap.to(imgRef.current, {
        y: -14,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    })();

    return () => tween?.kill();
  }, []);

  const imageHeight = isMobile ? 220 : isTablet ? 300 : 480;

  const imageBlock = (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: isTablet ? 40 : 0,
      }}
    >
      {/* Layered glow behind the subject so it reads as part of the panel, not a sticker */}
      <div
        style={{
          position: "absolute",
          width: imageHeight * 1.15,
          height: imageHeight * 1.15,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.colors.orange}33 0%, ${theme.colors.orange}00 70%)`,
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: imageHeight * 0.9,
          height: imageHeight * 0.9,
          borderRadius: "50%",
          background: "rgba(255,255,255,.05)",
          border: "1px solid rgba(255,255,255,.08)",
        }}
      />

      <img
        ref={imgRef}
        src="/img/2.png"
        alt="Padre e hijo revisando juntos el reporte de Teilen Teens"
        style={{
          position: "relative",
          height: imageHeight,
          width: "auto",
          objectFit: "contain",
          filter: "drop-shadow(0 20px 50px rgba(0,0,0,.4))",
        }}
      />

      {/* Floating chip — reinforces the parents-are-included message right next to the image */}
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            bottom: isTablet ? 8 : 28,
            left: isTablet ? "50%" : -12,
            transform: isTablet ? "translateX(-50%)" : "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "rgba(255,255,255,.09)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: 50,
            padding: "8px 16px",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 14 }}>💬</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.85)" }}>
            Salomón IA también acompaña a los padres
          </span>
        </div>
      )}
    </div>
  );

  return (
    <section style={{ backgroundColor: theme.colors.navy, padding: "96px 0", fontFamily: theme.font }} ref={ref}>
      <div style={{ ...fadeStyle, maxWidth: 1140, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: 72, alignItems: "center" }}>
          {isTablet && imageBlock}

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

          {!isTablet && imageBlock}
        </div>
      </div>
    </section>
  );
}