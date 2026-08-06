"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { validateInviteToken } from "@/_actions/accept-invite";
import { AlertCircleIcon, CheckCircleIcon, Loader2Icon, MailIcon } from "lucide-react";

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "validating" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (!token || !emailParam) {
      setStatus("error");
      setMessage("Invalid invitation link. Please check the URL or request a new invite.");
      return;
    }

    setEmail(emailParam);

    const validate = async () => {
      setStatus("validating");
      const result = await validateInviteToken(token, emailParam);
      
      if (result.success) {
        setStatus("success");
        // Redirect to complete signup with a short-lived session token
        // The server action returns a one-time use token for the next step
        if (result.sessionToken) {
          router.push(`/auth/complete-signup?token=${result.sessionToken}&email=${encodeURIComponent(emailParam)}`);
        } else {
          setStatus("error");
          setMessage("Failed to proceed. Please try again or request a new invite.");
        }
      } else {
        setStatus("error");
        setMessage(result.error || "This invitation is invalid or has expired.");
      }
    };

    validate();
  }, [searchParams, router]);

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f9fafb",
      padding: "24px",
      fontFamily: "'Geist', 'Inter', system-ui, sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "440px",
        background: "#ffffff",
        borderRadius: "16px",
        padding: "40px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}>
        <div style={{ marginBottom: "24px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            background: status === "error" ? "#fef2f2" : status === "success" ? "#f0fdf4" : "#111827",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            color: status === "error" ? "#ef4444" : status === "success" ? "#16a34a" : "#ffffff",
          }}>
            {status === "loading" || status === "validating" ? (
              <Loader2Icon style={{ animation: "spin 1s linear infinite" }} />
            ) : status === "success" ? (
              <CheckCircleIcon />
            ) : (
              <AlertCircleIcon />
            )}
          </div>

          <h1 style={{
            margin: "0 0 8px",
            fontSize: "22px",
            fontWeight: 700,
            color: "#111827",
          }}>
            {status === "loading" || status === "validating" 
              ? "Verifying invitation…" 
              : status === "success" 
                ? "Invitation verified!" 
                : "Invalid invitation"}
          </h1>

          <p style={{ margin: 0, fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}>
            {status === "loading" || status === "validating"
              ? "Please wait while we check your invite…"
              : status === "success"
                ? `Redirecting to complete your account setup for ${email}…`
                : message}
          </p>
        </div>

        {status === "error" && (
          <div style={{ marginTop: "24px" }}>
            <button
              onClick={() => router.push("/")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#ffffff",
                background: "#111827",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <MailIcon size={16} />
              Return to Home
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2Icon style={{ animation: "spin 1s linear infinite" }} />
      </div>
    }>
      <AcceptInviteContent />
    </Suspense>
  );
}