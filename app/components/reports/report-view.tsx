"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCcw, Pencil, Check, X } from "lucide-react";
import {
  getReportDetail,
  updateReportContent,
  retryReportGeneration,
  type ReportDetail,
  type ReportContent,
} from "@/_actions/reports";

const ACCENT = "#FF5A1F";

export function ReportView({ initial }: { initial: ReportDetail }) {
  const [report, setReport] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ReportContent | null>(initial.content);
  const [saving, setSaving] = useState(false);
  const [retrying, setRetrying] = useState(false);

  // Poll while pending/generating
  useEffect(() => {
    if (report.status !== "pending" && report.status !== "generating") return;

    const interval = setInterval(async () => {
      const res = await getReportDetail(report.id);
      if (res.success) {
        setReport(res.data);
        if (res.data.status === "completed") setDraft(res.data.content);
      }
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

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    const res = await updateReportContent(report.id, draft);
    if (res.success) {
      setReport({ ...report, content: draft });
      setEditing(false);
    }
    setSaving(false);
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
  const content = report.content!;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[19px] font-semibold text-black">{report.testTitle}</h1>
          <p className="mt-1 text-[12px] text-black/40">
            Actualizado{" "}
            {new Date(report.updatedAt).toLocaleDateString("es", { month: "short", day: "numeric" })}
          </p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-full border border-black/[0.08] px-3.5 py-1.5 text-[12.5px] font-medium text-black/60 hover:border-black/20 hover:text-black"
          >
            <Pencil className="h-3.5 w-3.5" /> Editar
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setDraft(report.content);
                setEditing(false);
              }}
              className="flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium text-black/40 hover:text-black"
            >
              <X className="h-3.5 w-3.5" /> Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: ACCENT }}
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Guardar
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
        {editing ? (
          <textarea
            value={draft?.summary ?? ""}
            onChange={(e) => setDraft((d) => (d ? { ...d, summary: e.target.value } : d))}
            rows={3}
            className="w-full resize-none rounded-xl border border-black/[0.08] p-3 text-[13.5px] text-black outline-none focus:border-black/25"
          />
        ) : (
          <p className="text-[14px] leading-relaxed text-black/75">{content.summary}</p>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {(editing ? draft?.sections : content.sections)?.map((section, i) => (
          <div key={i} className="rounded-2xl border border-black/[0.06] bg-white p-6">
            {editing ? (
              <>
                <input
                  value={section.title}
                  onChange={(e) =>
                    setDraft((d) => {
                      if (!d) return d;
                      const sections = [...d.sections];
                      sections[i] = { ...sections[i], title: e.target.value };
                      return { ...d, sections };
                    })
                  }
                  className="mb-2 w-full rounded-lg border border-black/[0.08] px-2.5 py-1.5 text-[13px] font-semibold text-black outline-none focus:border-black/25"
                />
                <textarea
                  value={section.body}
                  onChange={(e) =>
                    setDraft((d) => {
                      if (!d) return d;
                      const sections = [...d.sections];
                      sections[i] = { ...sections[i], body: e.target.value };
                      return { ...d, sections };
                    })
                  }
                  rows={4}
                  className="w-full resize-none rounded-xl border border-black/[0.08] p-3 text-[13px] text-black outline-none focus:border-black/25"
                />
              </>
            ) : (
              <>
                <h3 className="mb-2 text-[13.5px] font-semibold text-black">{section.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-black/65">{section.body}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}