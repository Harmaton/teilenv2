"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CheckEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    // if (!email || resending) return;
    // setResending(true);
    // setError(null);

    // const supabase = createClient();
    // const { error } = await supabase.auth.signInWithOtp({
    //   email,
    //   options: { shouldCreateUser: true },
    // });

    // setResending(false);

    // if (error) {
    //   setError(error.message || "No se pudo reenviar el correo.");
    //   return;
    // }

    setResent(true);
    setTimeout(() => setResent(false), 4000);
  };

  return (
    <div style={styles.page}>
      <div style={styles.grid} aria-hidden="true" />

      <div style={styles.panel}>
        <Corner style={{ top: -1, left: -1 }} />
        <Corner style={{ top: -1, right: -1, transform: "rotate(90deg)" }} />
        <Corner style={{ bottom: -1, left: -1, transform: "rotate(-90deg)" }} />
        <Corner style={{ bottom: -1, right: -1, transform: "rotate(180deg)" }} />

        <div style={styles.iconWrap}>
          <EnvelopeIcon />
        </div>

        <h1 style={styles.title}>Revisa tu correo</h1>

        <p style={styles.subtitle}>
          {email ? (
            <>
              Enviamos un enlace de acceso a{" "}
              <span style={styles.emailHighlight}>{email}</span>.
            </>
          ) : (
            "Enviamos un enlace de acceso a tu correo."
          )}{" "}
          Ábrelo desde este dispositivo para continuar.
        </p>

        <div style={styles.divider} />

        <p style={styles.helperText}>
          {resent
            ? "Enlace reenviado. Revisa tu bandeja de entrada."
            : "¿No lo encuentras? Revisa spam o promociones."}
        </p>

        <button
          style={{
            ...styles.resendBtn,
            opacity: resending || !email ? 0.6 : 1,
            cursor: resending || !email ? "default" : "pointer",
          }}
          onClick={handleResend}
          disabled={resending || !email}
        >
          {resending ? "Reenviando..." : "Reenviar enlace"}
        </button>

        {error && <p style={styles.errorText}>{error}</p>}

        <button style={styles.backBtn} onClick={() => router.replace("/login")}>
          Usar otro correo
        </button>
      </div>

      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

function Corner({ style }: { style: React.CSSProperties }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      style={{ position: "absolute", ...style }}
      aria-hidden="true"
    >
      <path d="M1 17V1H17" stroke="#2F6FED" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect
        x="4"
        y="10"
        width="36"
        height="26"
        rx="4"
        stroke="#2F6FED"
        strokeWidth="1.5"
        fill="rgba(47,111,237,0.08)"
      />
      <path
        d="M6 13l16 12 16-12"
        stroke="#2F6FED"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#05070D",
    position: "relative",
    overflow: "hidden",
    fontFamily:
      "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif",
    padding: 24,
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(47,111,237,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(47,111,237,0.06) 1px, transparent 1px)",
    backgroundSize: "42px 42px",
    maskImage: "radial-gradient(circle at 50% 40%, black, transparent 70%)",
  },
  panel: {
    position: "relative",
    width: "100%",
    maxWidth: 400,
    padding: "48px 36px",
    borderRadius: 4,
    background: "rgba(15,20,32,0.72)",
    border: "1px solid rgba(47,111,237,0.16)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    textAlign: "center",
  },
  iconWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    margin: 0,
    color: "#F5F7FA",
    fontSize: 19,
    fontWeight: 600,
    letterSpacing: "-0.2px",
  },
  subtitle: {
    margin: "10px 0 0",
    color: "#8B93A7",
    fontSize: 14,
    lineHeight: 1.6,
  },
  emailHighlight: {
    color: "#F5F7FA",
    fontWeight: 600,
  },
  divider: {
    height: 1,
    background: "rgba(139,147,167,0.14)",
    margin: "28px 0 20px",
  },
  helperText: {
    margin: 0,
    color: "#6B7280",
    fontSize: 12.5,
    lineHeight: 1.6,
  },
  resendBtn: {
    marginTop: 16,
    width: "100%",
    padding: "12px 20px",
    fontSize: 13,
    fontWeight: 600,
    color: "#F5F7FA",
    background: "rgba(47,111,237,0.14)",
    border: "1px solid rgba(47,111,237,0.35)",
    borderRadius: 4,
  },
  errorText: {
    margin: "12px 0 0",
    color: "#EF4444",
    fontSize: 12.5,
    lineHeight: 1.6,
  },
  backBtn: {
    marginTop: 14,
    width: "100%",
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: 500,
    color: "#8B93A7",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
};