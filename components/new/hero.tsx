"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { theme } from "@/lib/theme";
import { createClient } from "@/lib/supabase/client";

export default function Hero({ initialUser }: { initialUser: User | null }) {
  const { isTablet } = useBreakpoint();
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const firstName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user?.email?.split("@")[0];

  const ctaHref = user ? "/dashboard" : "/dashboard";
  const ctaLabel = user
    ? `→ Ver mi Identidad Evolutiva`
    : "→ Descubrí tu Identidad Evolutiva";

  return (
    <section
      style={{
        minHeight: "100vh",
        paddingTop: 68,
        backgroundColor: theme.colors.navy,
        display: "grid",
        gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        fontFamily: theme.font,
      }}
    >
      <div
        style={{
          padding: isTablet ? "120px 32px 72px" : "100px 56px 100px 72px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span
          style={{
            display: "inline-block",
            border: "1px solid rgba(224,120,32,.5)",
            color: theme.colors.orange,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            padding: "7px 16px",
            borderRadius: 50,
            marginBottom: 28,
            backgroundColor: "rgba(224,120,32,.1)",
          }}
        >
          {user
            ? `Bienvenido${firstName ? `, ${firstName}` : ""}`
            : "Basado en 6 estudios de neurociencia y psicología del comportamiento"}
        </span>

        <h1
          style={{
            fontSize: isTablet ? 34 : 52,
            fontWeight: 900,
            color: theme.colors.white,
            lineHeight: 1.1,
            marginBottom: 22,
          }}
        >
          Descubrí quién sos de verdad.
          <span style={{ color: theme.colors.orange, display: "block" }}>
            Antes de que alguien más decida por vos.
          </span>
        </h1>

        <p
          style={{
            fontSize: 17,
            color: "rgba(255,255,255,.72)",
            maxWidth: 480,
            marginBottom: 38,
            lineHeight: 1.72,
          }}
        >
          En 10 minutos, Teilen Teens construye tu Identidad Evolutiva: un mapa completo de
          cómo pensás, qué te mueve, en qué sos naturalmente bueno y hacia dónde tiene sentido ir.
        </p>

        <a
          href={ctaHref}
          rel="noopener noreferrer"
          style={{
            backgroundColor: theme.colors.orange,
            color: theme.colors.white,
            padding: "20px 44px",
            borderRadius: 50,
            fontFamily: theme.font,
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: ".04em",
            textTransform: "uppercase",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 12,
          }}
        >
          {ctaLabel}
        </a>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,.4)", display: "block", marginTop: 8 }}>
          {user
            ? "Retomá donde lo dejaste"
            : "Sin registros previos · Sin tarjeta de crédito · El resumen es gratis"}
        </span>

        <div
          style={{
            marginTop: 44,
            paddingTop: 28,
            borderTop: "1px solid rgba(255,255,255,.1)",
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          {[
            { icon: "⭐", strong: "4.9 / 5.0", rest: "satisfacción" },
            { icon: "👤", strong: "+1.200", rest: "jóvenes" },
            { icon: "🌎", strong: "", rest: "América Latina" },
          ].map((item, i) => (
            <span key={i} style={{ fontSize: 13, color: "rgba(255,255,255,.55)", fontWeight: 500 }}>
              {item.icon} {item.strong && <strong style={{ color: theme.colors.orange }}>{item.strong}</strong>} {item.rest}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          height: isTablet ? 300 : "100vh",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src="img/1.png"
          alt="Joven señalando hacia vos"
          style={{ height: "92%", width: "auto", objectFit: "contain", position: "relative", zIndex: 1 }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 200,
            background: `linear-gradient(to top, ${theme.colors.navy}, transparent)`,
            zIndex: 2,
          }}
        />
      </div>
    </section>
  );
}