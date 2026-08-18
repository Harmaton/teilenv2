"use client";

import React, { useEffect, useRef, useState } from "react";
import { theme } from "@/lib/theme";
import { useBreakpoint, useFadeIn } from "@/hooks/use-breakpoint";

const steps = [
  {
    num: "01",
    title: "Completás el estudio",
    desc: "Respondés preguntas sobre vos: tus valores, cómo pensás, qué te importa. No hay respuestas correctas o incorrectas.",
    badge: "⏱ 10 minutos",
  },
  {
    num: "02",
    title: "El algoritmo analiza",
    desc: "Seis estudios científicos cruzan tus respuestas y construyen tu perfil único. No hay resultados genéricos.",
    badge: "🔬 Análisis personalizado",
  },
  {
    num: "03",
    title: "Recibís tu resumen",
    desc: "Una primera mirada a tu identidad. Si querés profundizar, desbloqueás el reporte completo.",
    badge: "📄 Inmediato",
  },
  {
    num: "04",
    title: "Hablás con Salomón IA",
    desc: "Tu mentor virtual por WhatsApp toma tu reporte y lo convierte en decisiones concretas.",
    badge: "💬 WhatsApp",
  },
];

export default function HowItWorks() {
  const { isTablet, isMobile } = useBreakpoint();
  const { ref: sectionRef, style: fadeStyle } = useFadeIn<HTMLDivElement>();
  const stacked = isMobile || isTablet;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (stacked) return; // GSAP pin only runs on desktop layout

    let ctx: import("gsap/all").Context | undefined;
    let scrollTriggerInstances: any[] = [];

    (async () => {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.gsap ?? gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        if (!wrapperRef.current || !railRef.current) return;

        // Pin the rail for the duration the right column scrolls past it
        const pinTrigger = ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: "top top+=120",
          end: "bottom bottom",
          pin: railRef.current,
          pinSpacing: false,
        });
        scrollTriggerInstances.push(pinTrigger);

        // One trigger per panel to drive the active index + rail visuals
        steps.forEach((_, i) => {
          const panel = panelRefs.current[i];
          if (!panel) return;

          const st = ScrollTrigger.create({
            trigger: panel,
            start: "top center",
            end: "bottom center",
            onEnter: () => setActive(i),
            onEnterBack: () => setActive(i),
          });
          scrollTriggerInstances.push(st);
        });
      }, wrapperRef);
    })();

    return () => {
      scrollTriggerInstances.forEach((st) => st.kill());
      ctx?.revert();
    };
  }, [stacked]);

  // Animate the rail (number, title, dots, connecting lines) whenever active changes
  useEffect(() => {
    if (stacked) return;

    (async () => {
      const gsapModule = await import("gsap");
      const gsap = gsapModule.gsap ?? gsapModule.default;

      if (numberRef.current) {
        gsap.fromTo(
          numberRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
        );
        numberRef.current.textContent = steps[active].num;
      }
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: 0.05 }
        );
        titleRef.current.textContent = steps[active].title;
      }

      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        gsap.to(dot, {
          backgroundColor: i <= active ? theme.colors.orange : "rgba(224,120,32,.2)",
          boxShadow: i === active ? "0 0 0 4px rgba(224,120,32,.15)" : "0 0 0 0 rgba(224,120,32,0)",
          duration: 0.35,
          ease: "power2.out",
        });
      });

      lineRefs.current.forEach((line, i) => {
        if (!line) return;
        gsap.to(line, {
          backgroundColor: i < active ? theme.colors.orange : "rgba(224,120,32,.15)",
          duration: 0.35,
          ease: "power2.out",
        });
      });

      labelRefs.current.forEach((label, i) => {
        if (!label) return;
        gsap.to(label, {
          color: i === active ? theme.colors.navy : theme.colors.muted,
          duration: 0.35,
          ease: "power2.out",
        });
      });
    })();
  }, [active, stacked]);

  return (
    <section
      style={{
        backgroundColor: theme.colors.white,
        padding: stacked ? "72px 0" : "96px 0",
        fontFamily: theme.font,
      }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 32px" }}>
        <div ref={sectionRef} style={fadeStyle}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: theme.colors.orange,
              display: "block",
              marginBottom: 14,
            }}
          >
            El proceso
          </span>
          <h2
            style={{
              fontSize: stacked ? 28 : 38,
              fontWeight: 900,
              color: theme.colors.navy,
              lineHeight: 1.15,
              marginBottom: stacked ? 32 : 12,
              maxWidth: 640,
            }}
          >
            Cuatro pasos. Diez minutos. Un mapa para toda la vida.
          </h2>
        </div>

        {stacked ? (
          // --- Mobile / tablet: simple vertical timeline, no pin ---
          <div style={{ position: "relative", marginTop: 24 }}>
            <div
              style={{
                position: "absolute",
                left: 22,
                top: 8,
                bottom: 8,
                width: 2,
                background: `linear-gradient(180deg, ${theme.colors.orange}, rgba(224,120,32,.12))`,
              }}
            />
            {steps.map((s, i) => (
              <div
                key={s.num}
                style={{
                  display: "flex",
                  gap: 20,
                  position: "relative",
                  paddingBottom: i === steps.length - 1 ? 0 : 40,
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    backgroundColor: theme.colors.navy,
                    color: theme.colors.orange,
                    fontSize: 14,
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `3px solid ${theme.colors.orange}`,
                    zIndex: 1,
                  }}
                >
                  {s.num}
                </div>
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontWeight: 700, color: theme.colors.navy, fontSize: 15, marginBottom: 6 }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: 13, color: theme.colors.muted, lineHeight: 1.65, marginBottom: 10 }}>
                    {s.desc}
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: 10,
                      color: theme.colors.orange,
                      fontWeight: 700,
                      backgroundColor: "rgba(224,120,32,.08)",
                      padding: "4px 12px",
                      borderRadius: 50,
                    }}
                  >
                    {s.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // --- Desktop: GSAP-pinned left rail + scrolling story panels ---
          <div
            ref={wrapperRef}
            style={{
              display: "grid",
              gridTemplateColumns: "0.85fr 1.15fr",
              gap: 64,
              marginTop: 48,
              alignItems: "start",
            }}
          >
            <div ref={railRef} style={{ width: "100%" }}>
              <div
                ref={numberRef}
                style={{
                  fontSize: 96,
                  fontWeight: 900,
                  color: "transparent",
                  WebkitTextStroke: "2px rgba(224,120,32,.25)",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {steps[0].num}
              </div>
              <div
                ref={titleRef}
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: theme.colors.navy,
                  marginBottom: 28,
                  maxWidth: 320,
                }}
              >
                {steps[0].title}
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {steps.map((s, i) => (
                  <div key={s.num} style={{ display: "flex", alignItems: "stretch", gap: 14 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 14 }}>
                      <div
                        ref={(el) => (dotRefs.current[i] = el)}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: i === 0 ? theme.colors.orange : "rgba(224,120,32,.2)",
                          flexShrink: 0,
                        }}
                      />
                      {i !== steps.length - 1 && (
                        <div
                          ref={(el) => (lineRefs.current[i] = el)}
                          style={{
                            width: 2,
                            flex: 1,
                            minHeight: 28,
                            backgroundColor: "rgba(224,120,32,.15)",
                          }}
                        />
                      )}
                    </div>
                    <span
                      ref={(el) => (labelRefs.current[i] = el)}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: i === 0 ? theme.colors.navy : theme.colors.muted,
                        paddingBottom: i !== steps.length - 1 ? 24 : 0,
                      }}
                    >
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {steps.map((s, i) => (
                <div
                  key={s.num}
                  ref={(el) => (panelRefs.current[i] = el)}
                  style={{
                    minHeight: "58vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "40px 0",
                    opacity: active === i ? 1 : 0.35,
                    transition: "opacity .45s ease",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: ".18em",
                      color: theme.colors.orange,
                      textTransform: "uppercase",
                      marginBottom: 12,
                      display: "block",
                    }}
                  >
                    Paso {s.num}
                  </span>
                  <h3
                    style={{
                      fontSize: 26,
                      fontWeight: 900,
                      color: theme.colors.navy,
                      marginBottom: 14,
                      lineHeight: 1.2,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      color: theme.colors.muted,
                      lineHeight: 1.75,
                      maxWidth: 440,
                      marginBottom: 18,
                    }}
                  >
                    {s.desc}
                  </p>
                  <span
                    style={{
                      display: "inline-flex",
                      width: "fit-content",
                      fontSize: 11,
                      color: theme.colors.orange,
                      fontWeight: 700,
                      backgroundColor: "rgba(224,120,32,.08)",
                      padding: "6px 14px",
                      borderRadius: 50,
                    }}
                  >
                    {s.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}