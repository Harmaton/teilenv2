"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, RefreshCcw, Sparkles, Download, X } from "lucide-react";
import {
  getReportDetail,
  retryReportGeneration,
  type ReportDetail,
} from "@/_actions/reports";
import { buildReportHtml } from "@/lib/report-html";

const ACCENT = "#FF5A1F";

const QUICK_EDITS = [
  { id: "concise", label: "Más conciso" },
  { id: "formal", label: "Más formal" },
  { id: "motivational", label: "Más motivador" },
  { id: "detailed", label: "Más detallado" },
];

export function ReportView({ initial }: { initial: ReportDetail }) {
  const [report, setReport] = useState(initial);
  const [retrying, setRetrying] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [applying, setApplying] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (report.status !== "pending" && report.status !== "generating") return;

    const interval = setInterval(async () => {
      const res = await getReportDetail(report.id);
      if (res.success) setReport(res.data);
    }, 3000);

    return () => clearInterval(interval);
  }, [report.status, report.id]);

  const handleRetry = async () => {
    setRetrying(true);
    const res = await retryReportGeneration(report.id);
    if (res.success) {
      setReport({ ...report, status: "pending", error: null });
      fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: report.id }),
      });
    }
    setRetrying(false);
  };

  const applyEdit = async (payload: { styleId?: string; instruction?: string }) => {
    setApplying(true);
    setEditError(null);
    try {
      const res = await fetch("/api/reports/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: report.id, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo aplicar la edición.");
      setReport((r) => ({ ...r, content: data.content, updatedAt: new Date().toISOString() }));
      setInstruction("");
      setEditPanelOpen(false);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setApplying(false);
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
    fragment: report.content ?? "",
    testTitle: report.testTitle,
    testDescription: report.testDescription,
    userName: report.user.fullName,
    updatedAt: report.updatedAt,
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
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 rounded-full border border-black/[0.08] px-3.5 py-1.5 text-[12.5px] font-medium text-black/60 hover:border-black/20 hover:text-black"
            >
              <Download className="h-3.5 w-3.5" /> Descargar PDF
            </button>
            <button
              onClick={() => setEditPanelOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-black/[0.08] px-3.5 py-1.5 text-[12.5px] font-medium text-black/60 hover:border-black/20 hover:text-black"
            >
              <Sparkles className="h-3.5 w-3.5" /> Editar con IA
            </button>
          </div>
        </div>

        {editPanelOpen && (
          <div className="mb-4 rounded-2xl border border-black/[0.08] bg-black/[0.02] p-4">
            <p className="mb-2 text-[12px] font-medium text-black/60">Estilos rápidos</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {QUICK_EDITS.map((q) => (
                <button
                  key={q.id}
                  disabled={applying}
                  onClick={() => applyEdit({ styleId: q.id })}
                  className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-black/70 hover:border-black/20 disabled:opacity-50"
                >
                  {q.label}
                </button>
              ))}
            </div>

            <p className="mb-1.5 text-[12px] font-medium text-black/60">O describe el cambio</p>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={2}
              placeholder="Ej. Enfócate más en las fortalezas de liderazgo del usuario..."
              className="w-full resize-none rounded-xl border border-black/[0.08] p-3 text-[13px] text-black outline-none focus:border-black/25"
            />

            {editError && <p className="mt-2 text-[12px] text-red-500">{editError}</p>}

            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditPanelOpen(false);
                  setInstruction("");
                  setEditError(null);
                }}
                className="rounded-full px-3.5 py-1.5 text-[12.5px] font-medium text-black/40 hover:text-black"
              >
                Cancelar
              </button>
              <button
                onClick={() => instruction.trim() && applyEdit({ instruction: instruction.trim() })}
                disabled={applying || !instruction.trim()}
                className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12.5px] font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: ACCENT }}
              >
                {applying && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Aplicar
              </button>
            </div>
          </div>
        )}

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
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
              style={{ backgroundColor: ACCENT }}
            >
              {initials}
            </div>
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