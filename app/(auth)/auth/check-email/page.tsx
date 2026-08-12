"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CheckEmailPage() {
  return (
    <Suspense fallback={<PageShell />}>
      <CheckEmailContent />
    </Suspense>
  );
}

function CheckEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    if (!email || resending) return;

    setResending(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (resendError) {
        setError(
          resendError.message === "For security purposes, you can only request this after 60 seconds."
            ? "Espera unos segundos antes de reenviar."
            : "No pudimos reenviar el enlace. Intenta de nuevo."
        );
        return;
      }

      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch {
      setError("Ocurrió un error inesperado. Intenta de nuevo.");
    } finally {
      setResending(false);
    }
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

export function PageShell() {
  return (
    <div style={styles.page}>
      <div style={styles.grid} aria-hidden="true" />
      <div style={styles.panel}>
        <div style={styles.iconWrap}>
          <EnvelopeIcon />
        </div>
        <h1 style={styles.title}>Revisa tu correo</h1>
        <p style={styles.subtitle}>Cargando...</p>
      </div>
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
      <path d="M1 17V1H17" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
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
        stroke="#f59e0b"
        strokeWidth="1.5"
        fill="rgba(251,146,60,0.12)"
      />
      <path
        d="M6 13l16 12 16-12"
        stroke="#f59e0b"
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
    background: "radial-gradient(circle at top, rgba(251,146,60,0.16), transparent 35%), #08090f",
    position: "relative",
    overflow: "hidden",
    fontFamily:
      "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif",
    padding: 32,
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(251,146,60,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.05) 1px, transparent 1px)",
    backgroundSize: "42px 42px",
    maskImage: "radial-gradient(circle at 50% 40%, black, transparent 70%)",
  },
  panel: {
    position: "relative",
    width: "100%",
    maxWidth: 440,
    padding: "44px 36px",
    borderRadius: 24,
    background: "rgba(15,20,32,0.92)",
    border: "1px solid rgba(251,146,60,0.18)",
    boxShadow: "0 32px 90px rgba(251,146,60,0.14)",
    backdropFilter: "blur(26px)",
    WebkitBackdropFilter: "blur(26px)",
    textAlign: "center",
  },
  iconWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 24,
    padding: 18,
    borderRadius: 18,
    background: "rgba(251,146,60,0.12)",
    boxShadow: "inset 0 0 0 1px rgba(251,146,60,0.18)",
  },
  title: {
    margin: 0,
    color: "#FDF8F1",
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: "-0.2px",
  },
  subtitle: {
    margin: "10px 0 0",
    color: "#DAD7CE",
    fontSize: 15,
    lineHeight: 1.7,
  },
  emailHighlight: {
    color: "#FBBF24",
    fontWeight: 700,
  },
  divider: {
    height: 1,
    background: "rgba(251,146,60,0.2)",
    margin: "28px 0 20px",
  },
  helperText: {
    margin: 0,
    color: "#D1D5DB",
    fontSize: 13,
    lineHeight: 1.75,
  },
  resendBtn: {
    marginTop: 16,
    width: "100%",
    padding: "14px 22px",
    fontSize: 14,
    fontWeight: 700,
    color: "#FFF7ED",
    background: "#F97316",
    border: "1px solid rgba(249,115,22,0.24)",
    borderRadius: 16,
    boxShadow: "0 14px 30px rgba(249,115,22,0.18)",
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
    padding: "12px 20px",
    fontSize: 13,
    fontWeight: 600,
    color: "#FBBF24",
    background: "rgba(251,146,60,0.08)",
    border: "1px solid rgba(251,146,60,0.18)",
    borderRadius: 16,
    cursor: "pointer",
    textDecoration: "none",
  },
};