import Link from "next/link";
import { FileBarChart2, Clock, XCircle, ArrowUpRight } from "lucide-react";
import { getUserReports, type ReportStatus } from "@/_actions/reports";
import { cn } from "@/lib/utils";

const ACCENT = "#FF5A1F";

const STATUS_META: Record<ReportStatus, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: "En cola", icon: Clock, color: "text-black/40" },
  generating: { label: "Generando", icon: Clock, color: "" }, // orange, set inline
  completed: { label: "Listo", icon: FileBarChart2, color: "text-emerald-600" },
  failed: { label: "Falló", icon: XCircle, color: "text-red-600" },
};

export default async function ReportsPage() {
  const result = await getUserReports();
  const reports = result.success ? result.data : [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-black">Informes</h1>
        <p className="mt-1 text-[13px] text-black/45">
          Tus informes generados a partir de los tests completados.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-black/[0.06] bg-black/[0.02] px-6 py-10 text-center">
          <p className="text-[13px] text-black/45">Aún no tienes informes.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {reports.map((r) => {
            const meta = STATUS_META[r.status];
            const Icon = meta.icon;
            const isGenerating = r.status === "generating" || r.status === "pending";
            return (
              <Link
                key={r.id}
                href={`/reports/${r.id}`}
                className="group flex items-center justify-between rounded-2xl border border-black/[0.06] bg-white px-5 py-4 transition-colors hover:border-black/[0.14]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: isGenerating ? "rgba(255,90,31,0.1)" : "rgba(0,0,0,0.04)",
                    }}
                  >
                    <Icon
                      className={cn("h-4 w-4", meta.color)}
                      style={isGenerating ? { color: ACCENT } : undefined}
                    />
                  </div>
                  <div>
                    <p className="text-[13.5px] font-medium text-black">{r.testTitle}</p>
                    <p className="text-[11.5px] text-black/40">
                      {new Date(r.createdAt).toLocaleDateString("es", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={cn("text-[12px] font-medium", meta.color)}
                    style={isGenerating ? { color: ACCENT } : undefined}
                  >
                    {meta.label}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-black/20 transition-colors group-hover:text-black/50" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}