"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, RefreshCcw, Sparkles, Download, X } from "lucide-react";
import {
  getReportDetail,
  retryReportGeneration,
  type ReportDetail,
} from "@/_actions/reports";
import { getSalomonConversation, type SalomonMessage } from "@/_actions/salomon";
import { buildReportHtml } from "@/lib/report-html";
import { cn } from "@/lib/utils";
import SalomonCheckout from "../payments/SalomonCheckout";

const ACCENT = "#FF5A1F";

type ChatMessage = SalomonMessage;

export function ReportView({ initial }: { initial: ReportDetail }) {
  const [report, setReport] = useState(initial);
  const [retrying, setRetrying] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (report.status !== "pending" && report.status !== "generating") return;

    const interval = setInterval(async () => {
      const res = await getReportDetail(report.id);
      if (res.success) setReport(res.data);
    }, 3000);

    return () => clearInterval(interval);
  }, [report.status, report.id]);

  // ── Hydrate chat history + cap status from the DB so it survives reloads ──
  useEffect(() => {
    if (report.status !== "completed") return;
    let active = true;
    (async () => {
      const res = await getSalomonConversation(report.id);
      if (!active) return;
      if (res.success) {
        setMessages(res.data.messages);
        setLimitReached(res.data.limitReached);
      }
      setHistoryLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, [report.id, report.status]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, asking]);

  const handleRetry = async () => {
    setRetrying(true);
    const res = await retryReportGeneration(report.id);
    if (res.success) {
      setReport({ ...report, status: "pending", error: null });
      fetch("/api/reports/openai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: report.id }),
      });
    }
    setRetrying(false);
  };

  const askSalomon = async () => {
    const q = question.trim();
    if (!q || asking || limitReached) return;

    setChatError(null);
    setMessages((m) => [...m, { role: "user", content: q }]);
    setQuestion("");
    setAsking(true);
    try {
      const res = await fetch("/api/reports/openai/salomonai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: report.id,
          question: q,
          testTitle: report.testTitle,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.limitReached) setLimitReached(true);
        throw new Error(data.error ?? "No se pudo obtener una respuesta.");
      }

      setMessages((m) => [...m, { role: "assistant", content: data.answer }]);

      // If this was the last free reply, switch straight to the checkout
      // state instead of waiting for the next question to get blocked.
      if (typeof data.repliesRemaining === "number" && data.repliesRemaining <= 0) {
        setLimitReached(true);
      }
    } catch (err) {
      setChatError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setAsking(false);
    }
  };

  const handleDownloadPdf = () => {
    iframeRef.current?.contentWindow?.print();
  };

  // ── Generating / pending ─────────────────────────────────
  if (report.status === "pending" || report.status === "generating") {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-black/[0.06] bg-white px-8 py-16 text-center">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: ACCENT }} />
        <h1 className="mt-4 text-[16px] font-semibold text-black">Generando tu informe</h1>
        <p className="mt-1 text-[13px] text-black/45">
          {report.testTitle} — esto puede tardar un momento.
        </p>
      </div>
    );
  }

  // ── Failed ────────────────────────────────────────────────
  if (report.status === "failed") {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-black/[0.06] bg-white px-8 py-16 text-center">
        <X className="h-6 w-6 text-red-500" />
        <h1 className="mt-4 text-[16px] font-semibold text-black">No pudimos generar tu informe</h1>
        {report.error && (
          <p className="mt-1 max-w-sm text-[12.5px] text-black/40">{report.error}</p>
        )}
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: ACCENT }}
        >
          {retrying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />}
          Reintentar
        </button>
      </div>
    );
  }

  // ── Completed ─────────────────────────────────────────────
  const initials = (report.user.fullName ?? report.user.email ?? "U").slice(0, 2).toUpperCase();

 const fullHtml = buildReportHtml({
  fragment: report.content?.html ?? "",
  scores: report.content?.scores,
  testTitle: report.testTitle,
  testDescription: report.testDescription,
  userName: report.user.fullName,
  updatedAt: report.updatedAt,
  avatarUrl: report.user.avatarUrl,
  age: report.user.age,
  city: report.user.city,
  country: report.user.country,
});

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {/* ── Content column ───────────────────────────────── */}
      <div>
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[19px] font-semibold text-black">{report.testTitle}</h1>
            <p className="mt-1 text-[12px] text-black/40">
              Actualizado{" "}
              {new Date(report.updatedAt).toLocaleDateString("es", { month: "short", day: "numeric" })}
            </p>
          </div>
          <div className="relative flex shrink-0 items-center gap-2">
<button
  onClick={handleDownloadPdf}
  className="group relative flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-br from-red-500 to-red-600 px-3.5 py-1.5 text-[12.5px] font-medium text-white shadow-sm shadow-red-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-red-600 hover:to-red-700 hover:shadow-md hover:shadow-red-500/30 active:translate-y-0 active:scale-95"
>
  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
  <Download className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5 group-hover:scale-110" />
  Descargar PDF
</button>

  <button
    onClick={() => setEditPanelOpen((v) => !v)}
    aria-pressed={editPanelOpen}
    className={cn(
      "group flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-all duration-200 active:scale-95",
      editPanelOpen
        ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-sm shadow-orange-500/25"
        : "border border-orange-200 bg-gradient-to-br from-orange-50 to-white text-orange-700 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-[0_4px_12px_-4px_rgba(249,115,22,0.35)]"
    )}
  >
    <Sparkles
      className={cn(
        "h-3.5 w-3.5 transition-transform duration-200",
        editPanelOpen ? "text-white" : "text-orange-500 group-hover:rotate-12"
      )}
    />
    Pregúntale a Salomon AI
  </button>

  {/* ── Floating chat panel ──────────────────────────── */}
  {editPanelOpen && (
    <div className="absolute right-0 top-full z-20 mt-2 flex h-[420px] w-[380px] flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)]">
      <div className="flex shrink-0 items-center justify-between border-b border-black/[0.06] px-4 py-3">
        <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-black">
          <Sparkles className="h-3.5 w-3.5 text-orange-500" />
          Salomon AI
        </div>
        <button
          onClick={() => setEditPanelOpen(false)}
          aria-label="Cerrar chat"
          className="rounded-full p-1 text-black/30 hover:bg-black/5 hover:text-black/60"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {!historyLoaded ? (
          <div className="flex items-center gap-1.5 text-[12px] text-black/35">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Cargando conversación...
          </div>
        ) : messages.length === 0 ? (
          <p className="text-[12.5px] leading-relaxed text-black/40">
            Pregúntame lo que quieras sobre tu informe — por ejemplo: "¿Cuál es mi mayor fortaleza según este informe, y por qué?"
          </p>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2 text-[12.5px] leading-relaxed",
                  m.role === "user"
                    ? "bg-black/[0.06] text-black"
                    : "border border-orange-100 bg-orange-50/60 text-black/80"
                )}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
        {asking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl border border-orange-100 bg-orange-50/60 px-3.5 py-2 text-[12px] text-black/50">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Pensando...
            </div>
          </div>
        )}

        {limitReached && (
          <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4">
            <p className="mb-3 text-[12.5px] leading-relaxed text-black/60">
              Has alcanzado el límite de preguntas gratuitas para este informe. Desbloquea el chat para seguir hablando con Salomon AI.
            </p>
            <SalomonCheckout reportId={report.id} />
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {chatError && !limitReached && <p className="px-4 pb-2 text-[12px] text-red-500">{chatError}</p>}

      {!limitReached && (
        <div className="flex shrink-0 items-center gap-2 border-t border-black/[0.06] p-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                askSalomon();
              }
            }}
            placeholder="Escribe tu pregunta..."
            className="flex-1 rounded-full border border-black/[0.08] px-3.5 py-2 text-[13px] text-black outline-none focus:border-black/25"
          />
          <button
            onClick={askSalomon}
            disabled={asking || !question.trim()}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: ACCENT }}
          >
            {asking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Enviar"}
          </button>
        </div>
      )}
    </div>
  )}
</div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
          <iframe
            ref={iframeRef}
            title="Vista previa del informe"
            srcDoc={fullHtml}
            className="h-[70vh] w-full"
            sandbox="allow-same-origin allow-modals"
          />
        </div>
      </div>

      {/* ── Snapshot sidebar ─────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35">Usuario</p>
          <div className="flex items-center gap-3">
            {report.user.avatarUrl ? (
              <img src={report.user.avatarUrl} alt="Avatar" className="h-10 w-10 shrink-0 rounded-full object-cover" />
            ) : (
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                style={{ backgroundColor: ACCENT }}
              >
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-black">
                {report.user.fullName ?? "Sin nombre"}
              </p>
              <p className="truncate text-[12px] text-black/40">{report.user.email}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35">Test</p>
          <p className="text-[13px] font-medium text-black">{report.testTitle}</p>
          {report.testDescription && (
            <p className="mt-1 text-[12.5px] leading-relaxed text-black/55">{report.testDescription}</p>
          )}
          {report.attemptCompletedAt && (
            <p className="mt-3 text-[11.5px] text-black/40">
              Completado{" "}
              {new Date(report.attemptCompletedAt).toLocaleDateString("es", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}