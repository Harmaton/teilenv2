"use client";

import { useActionState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { completeSignupAction, type CompleteSignupResult } from "@/_actions/accept-invite";
import { AlertCircleIcon, CheckCircleIcon, Loader2Icon, LockIcon, UserIcon, MailIcon } from "lucide-react";

function Field({
  id,
  label,
  icon,
  disabled,
  hint,
  ...props
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label htmlFor={id} style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "#71717a",
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <span style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          color: "#a1a1aa", display: "flex", alignItems: "center", pointerEvents: "none", zIndex: 1,
        }}>
          {icon}
        </span>
        <input
          id={id}
          disabled={disabled}
          {...props}
          style={{
            width: "100%", boxSizing: "border-box",
            paddingLeft: 44, paddingRight: 16, paddingTop: 13, paddingBottom: 13,
            fontSize: 14, fontFamily: "inherit",
            color: disabled ? "#a1a1aa" : "#18181b",
            border: "1.5px solid #e4e4e7", borderRadius: 10,
            background: disabled ? "#fafafa" : "#ffffff",
            outline: "none", cursor: disabled ? "not-allowed" : "text",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onFocus={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = "#18181b";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(24,24,27,0.06)";
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#e4e4e7";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>
      {hint && (
        <p style={{ margin: 0, fontSize: 12, color: "#a1a1aa" }}>{hint}</p>
      )}
    </div>
  );
}

// ─── Form body ────────────────────────────────────────────────────────────────

function CompleteSignupForm({
  state, isPending, email,
}: {
  state: CompleteSignupResult | null;
  isPending: boolean;
  email: string;
}) {
  const router = useRouter();
  if (state?.success) setTimeout(() => router.push("/dashboard"), 1600);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      <Field id="email-display" label="Email address" icon={<MailIcon size={16} />}
        type="email" value={email} disabled readOnly />

      <Field id="fullName" name="fullName" label="Full name" icon={<UserIcon size={16} />}
        type="text" placeholder="Jane Doe" required disabled={isPending} autoComplete="name" />

      <Field id="password" name="password" label="Password" icon={<LockIcon size={16} />}
        type="password" placeholder="Min. 8 characters" minLength={8} required
        disabled={isPending} autoComplete="new-password"
        hint="Must be at least 8 characters" />

      {state && (
        <div role={state.success ? "status" : "alert"} style={{
          display: "flex", alignItems: "flex-start", gap: 10,
          padding: "12px 14px", borderRadius: 10, fontSize: 13, lineHeight: 1.5,
          background: state.success ? "#f0fdf4" : "#fff1f2",
          border: `1px solid ${state.success ? "#bbf7d0" : "#fecdd3"}`,
          color: state.success ? "#15803d" : "#be123c",
        }}>
          <span style={{ flexShrink: 0, marginTop: 1 }}>
            {state.success ? <CheckCircleIcon size={16} /> : <AlertCircleIcon size={16} />}
          </span>
          <span>{state.success ? state.message : state.error}</span>
        </div>
      )}

      <button type="submit" disabled={isPending} style={{
        marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        width: "100%", padding: "14px 24px", fontSize: 14, fontWeight: 700, fontFamily: "inherit",
        letterSpacing: "-0.01em", color: "#ffffff",
        background: isPending ? "#a1a1aa" : "#18181b",
        border: "none", borderRadius: 10, cursor: isPending ? "not-allowed" : "pointer",
        transition: "background 0.15s, transform 0.1s, box-shadow 0.15s",
        boxShadow: isPending ? "none" : "0 2px 12px rgba(24,24,27,0.18)",
      }}
        onMouseEnter={(e) => {
          if (!isPending) {
            (e.currentTarget as HTMLButtonElement).style.background = "#27272a";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(24,24,27,0.22)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isPending) {
            (e.currentTarget as HTMLButtonElement).style.background = "#18181b";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 12px rgba(24,24,27,0.18)";
          }
        }}
      >
        {isPending
          ? <><Loader2Icon size={15} style={{ animation: "spin 0.8s linear infinite" }} /> Creating account…</>
          : "Activate Account →"}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Suspense-wrapped content ─────────────────────────────────────────────────

function CompleteSignupContent() {
  const [state, formAction, isPending] = useActionState<CompleteSignupResult | null, FormData>(
    completeSignupAction, null
  );
  const email = useSearchParams().get("email") || "";

  if (!email) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
      <AlertCircleIcon size={28} color="#ef4444" />
      <p style={{ margin: 0, fontSize: 14, color: "#71717a" }}>
        Missing email. Please restart the invitation process.
      </p>
    </div>
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="email" value={email} />
      <CompleteSignupForm state={state} isPending={isPending} email={email} />
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompleteSignupPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sp-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', system-ui, sans-serif;
          background: #ffffff;
        }

        /* LEFT IMAGE PANEL */
        .sp-left {
          display: none;
          position: relative;
          flex: 1;
          overflow: hidden;
        }
        @media (min-width: 860px) { .sp-left { display: block; } }

        .sp-left img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
        }

        /* layered overlay: dark vignette + green tint strip at bottom */
        .sp-left-overlay {
          position: absolute; inset: 0;
          background:
            linear-gradient(to bottom,
              rgba(9,9,11,0.42) 0%,
              rgba(9,9,11,0.10) 45%,
              rgba(4,47,27,0.70) 100%);
        }

        .sp-left-inner {
          position: relative; z-index: 2;
          height: 100%;
          display: flex; flex-direction: column;
          justify-content: space-between;
          padding: 44px 48px;
        }

        .sp-logo {
          display: flex; align-items: center; gap: 10px;
          font-size: 14px; font-weight: 700;
          color: #fff; letter-spacing: -0.02em;
        }
        .sp-logo-pulse {
          width: 8px; height: 8px; border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 0 0 rgba(16,185,129,0.5);
          animation: pulse-ring 2s ease-out infinite;
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0   rgba(16,185,129,0.6); }
          70%  { box-shadow: 0 0 0 10px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0   rgba(16,185,129,0); }
        }

        .sp-quote {
          display: flex; flex-direction: column; gap: 14px;
        }
        .sp-quote blockquote {
          font-size: clamp(1.25rem, 2.2vw, 1.55rem);
          font-weight: 300; line-height: 1.5;
          color: #ffffff; letter-spacing: -0.02em;
        }
        .sp-quote blockquote em {
          font-style: italic; color: #6ee7b7;
        }
        .sp-quote cite {
          font-size: 12px; color: rgba(255,255,255,0.45);
          font-style: normal; letter-spacing: 0.05em; text-transform: uppercase;
        }

        /* RIGHT FORM PANEL */
        .sp-right {
          width: 100%;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 24px;
          background: #fafafa;
        }
        @media (min-width: 860px) {
          .sp-right {
            width: 460px; flex-shrink: 0;
            padding: 56px 52px;
            background: #ffffff;
            border-left: 1px solid #f0f0f0;
            box-shadow: -8px 0 40px rgba(0,0,0,0.04);
          }
        }

        .sp-form-card {
          width: 100%; max-width: 368px;
          display: flex; flex-direction: column; gap: 28px;
        }

        .sp-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 12px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 999px; width: fit-content;
          font-size: 11px; font-weight: 600;
          color: #15803d; letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .sp-badge-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #10B981;
          animation: pulse-ring 2s ease-out infinite;
        }

        .sp-heading { display: flex; flex-direction: column; gap: 8px; }
        .sp-heading h1 {
          font-size: clamp(1.7rem, 4vw, 2.1rem);
          font-weight: 700; color: #09090b;
          letter-spacing: -0.045em; line-height: 1.12;
        }
        .sp-heading h1 span {
          background: linear-gradient(90deg, #10B981 0%, #059669 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sp-heading p {
          font-size: 14px; color: #71717a; line-height: 1.65;
        }

        .sp-divider {
          height: 1px; background: #f0f0f0;
        }

        .sp-footer {
          text-align: center; font-size: 12px;
          color: #a1a1aa; line-height: 1.6;
        }
        .sp-footer a {
          color: #a1a1aa; text-decoration: underline; text-underline-offset: 3px;
        }
        .sp-footer a:hover { color: #71717a; }
      `}</style>

      <div className="sp-root">

        {/* ── Left image panel ─────────────────────────────────── */}
        <div className="sp-left">
          <img
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1400&q=90&auto=format&fit=crop"
            alt="Team working on content strategy"
          />
          <div className="sp-left-overlay" />
          <div className="sp-left-inner">
            <div className="sp-logo">
              <span className="sp-logo-pulse" />
              AICE CMS
            </div>
            <div className="sp-quote">
              <blockquote>
                One platform to manage every story, every programme,{" "}
                <em>every voice</em> that matters.
              </blockquote>
              <cite>AICE Content Studio · Africa</cite>
            </div>
          </div>
        </div>

        {/* ── Right form panel ─────────────────────────────────── */}
        <div className="sp-right">
          <div className="sp-form-card">

            <div className="sp-badge">
              <span className="sp-badge-dot" />
              Invitation accepted
            </div>

            <div className="sp-heading">
              <h1>
                Activate your<br />
                <span>account</span>
              </h1>
              <p>
                Youre one step away — set your name and a password to get started.
              </p>
            </div>

            <div className="sp-divider" />

            <Suspense fallback={
              <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
                <Loader2Icon size={20} color="#a1a1aa"
                  style={{ animation: "spin 0.8s linear infinite" }} />
              </div>
            }>
              <CompleteSignupContent />
            </Suspense>

            <p className="sp-footer">
              Authorised AICE access only ·{" "}
              <a href="mailto:hr@adanianlabs.io">Contact support</a>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}