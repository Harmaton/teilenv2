"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageShell } from "../auth/check-email/page";

type Status = "verifying" | "success" | "error";


export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<PageShell />}>
      <VerifyPage />
    </Suspense>
  );
}

export function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState<string>("");
  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    const code = searchParams.get("code");

    if (!code) {
      setStatus("error");
      setMessage("Falta el código de verificación en el enlace.");
      return;
    }

    const verify = async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setStatus("error");
        setMessage(error.message || "No se pudo verificar el enlace.");
        return;
      }

      setStatus("success");
      // Hold on the confirmation tick briefly before redirecting.
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1400);
    };

    verify();
  }, [searchParams, router]);

  return (
    <div style={styles.page}>
      <div style={styles.grid} aria-hidden="true" />

      <div style={styles.panel}>
        <Corner style={{ top: -1, left: -1 }} />
        <Corner style={{ top: -1, right: -1, transform: "rotate(90deg)" }} />
        <Corner style={{ bottom: -1, left: -1, transform: "rotate(-90deg)" }} />
        <Corner style={{ bottom: -1, right: -1, transform: "rotate(180deg)" }} />

        <div style={styles.iconWrap}>
          {status === "verifying" && <Spinner />}
          {status === "success" && <Check />}
          {status === "error" && <ErrorMark />}
        </div>

        <h1 style={styles.title}>
          {status === "verifying" && "Verificando tu enlace"}
          {status === "success" && "Correo confirmado"}
          {status === "error" && "No pudimos verificarte"}
        </h1>

        <p style={styles.subtitle}>
          {status === "verifying" &&
            "Un momento mientras confirmamos tu acceso."}
          {status === "success" && "Redirigiendo a tu panel..."}
          {status === "error" && message}
        </p>

        {status === "error" && (
          <button style={styles.retryBtn} onClick={() => router.replace("/login")}>
            Volver a iniciar sesión
          </button>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes popIn {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }
          60% {
            transform: scale(1.08);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
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

function Spinner() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" style={{ animation: "spin 0.9s linear infinite" }}>
      <circle
        cx="20"
        cy="20"
        r="16"
        stroke="rgba(47,111,237,0.18)"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M20 4a16 16 0 0 1 16 16"
        stroke="#2F6FED"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" style={{ animation: "popIn 0.4s ease-out" }}>
      <circle cx="20" cy="20" r="18" fill="rgba(34,197,94,0.12)" stroke="#22C55E" strokeWidth="1.5" />
      <path
        d="M12 20.5l5.2 5.2L28.5 14"
        fill="none"
        stroke="#22C55E"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 1,
          animation: "drawCheck 0.5s 0.15s ease-out forwards",
        }}
      />
    </svg>
  );
}

function ErrorMark() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" style={{ animation: "popIn 0.4s ease-out" }}>
      <circle cx="20" cy="20" r="18" fill="rgba(239,68,68,0.12)" stroke="#EF4444" strokeWidth="1.5" />
      <path
        d="M14 14l12 12M26 14L14 26"
        stroke="#EF4444"
        strokeWidth="2.5"
        strokeLinecap="round"
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
    maskImage:
      "radial-gradient(circle at 50% 40%, black, transparent 70%)",
  },
  panel: {
    position: "relative",
    width: "100%",
    maxWidth: 380,
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
  retryBtn: {
    marginTop: 24,
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: 600,
    color: "#F5F7FA",
    background: "rgba(47,111,237,0.14)",
    border: "1px solid rgba(47,111,237,0.35)",
    borderRadius: 4,
    cursor: "pointer",
  },
};