
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { getReportDetailAdmin } from "@/_actions/admin-reports";

const ACCENT = "#FF5A1F";

const STATUS_STYLES: Record<string, { label: string; text: string }> = {
  completed: { label: "Completado", text: "text-emerald-700" },
  generating: { label: "Generando", text: "" }, // orange, set inline below
  pending: { label: "Pendiente", text: "text-amber-700" },
  failed: { label: "Fallido", text: "text-red-600" },
};

export default async function AdminReportDetailPage({ params }: { params: { id: string } }) {
  const result = await getReportDetailAdmin(params.id);

  if (!result.success) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-[13px] text-black/45">{result.error}</p>
      </div>
    );
  }

  const report = result.data;
  const style = STATUS_STYLES[report.status];
  const isGenerating = report.status === "generating";

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Link
        href="/admin/reports"
        className="mb-6 inline-flex items-center gap-1.5 text-[12.5px] text-black/45 hover:text-black"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Volver a informes
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          {/* <h1 className="text-[20px] font-semibold text-black">{report.test?.title ?? "Informe"}</h1> */}
          {/* <p className="mt-1 text-[13px] text-black/45">
            {report.profile?.fullName ?? "—"} · {report.profile?.email ?? "—"}
          </p> */}
        </div>
        <span
          className={cn("shrink-0 rounded-full px-3 py-1 text-[12px] font-medium", !isGenerating && style.text)}
          style={
            isGenerating
              ? { color: ACCENT, backgroundColor: "rgba(255,90,31,0.08)" }
              : { backgroundColor: "rgba(0,0,0,0.04)" }
          }
        >
          {style.label}
        </span>
      </div>

      {/* <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <InfoCard label="Modelo IA" value={report.aiModel ?? "—"} />
        <InfoCard label="Puntuación" value={report.attempt?.score ?? "—"} />
        <InfoCard label="Generado" value={formatDate(report.createdAt)} />
        <InfoCard label="Actualizado" value={formatDate(report.updatedAt)} />
      </div> */}

      {report.status === "failed" && report.error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {report.error}
        </div>
      )}

      <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
        <h2 className="mb-3 text-[13px] font-semibold text-black">Contenido</h2>
        <ReportContent content={report.content} />
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white px-4 py-3">
      <div className="text-[14px] font-semibold text-black">{value}</div>
      <div className="mt-0.5 text-[11.5px] text-black/45">{label}</div>
    </div>
  );
}

// `content` is a free-form jsonb column — render string fields as prose,
// anything else as formatted JSON, so this works whatever shape your AI
// pipeline is currently writing into `reports.content`.
function ReportContent({ content }: { content: unknown }) {
  if (!content || typeof content !== "object") {
    return <p className="text-[13px] text-black/45">Sin contenido.</p>;
  }

  const entries = Object.entries(content as Record<string, unknown>);
  if (entries.length === 0) {
    return <p className="text-[13px] text-black/45">Sin contenido.</p>;
  }

  return (
    <div className="space-y-4">
      {entries.map(([key, value]) => (
        <div key={key}>
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-black/35">
            {key.replace(/_/g, " ")}
          </div>
          {typeof value === "string" ? (
            <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-black/80">{value}</p>
          ) : (
            <pre className="overflow-x-auto rounded-lg bg-black/[0.03] p-3 text-[12px] text-black/70">
              {JSON.stringify(value, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es", { month: "short", day: "numeric", year: "numeric" });
}