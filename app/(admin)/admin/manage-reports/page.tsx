import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getReportsGroupedByUser } from "@/_actions/admin-reports";

const STATUS_LABELS: Record<string, string> = {
  completed: "Completado",
  generating: "Generando",
  pending: "Pendiente",
  failed: "Fallido",
};

export default async function ManageReportsPage() {
  const result = await getReportsGroupedByUser();

  if (!result.success) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-[13px] text-red-600">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-black">Informes</h1>
        <p className="mt-1 text-[13px] text-black/45">Informes generados por usuario.</p>
      </div>

      {result.data.length === 0 ? (
        <div className="rounded-2xl border border-black/[0.06] bg-white px-6 py-12 text-center text-[13px] text-black/45">
          Todavía no hay informes.
        </div>
      ) : (
        <div className="space-y-5">
          {result.data.map((group) => (
            <section key={group.profileId} className="rounded-2xl border border-black/[0.08] bg-white p-5">
              <div className="mb-4">
                <h2 className="text-[15px] font-semibold text-black">{group.fullName ?? "Usuario sin nombre"}</h2>
                <p className="mt-1 text-[12px] text-black/45">{group.email ?? "Sin correo"}</p>
              </div>

              <div className="divide-y divide-black/[0.06]">
                {group.reports.map((report) => (
                  <Link
                    key={report.id}
                    href={`/admin/manage-reports/${report.id}`}
                    className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-black/[0.02]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-black">{report.testTitle}</p>
                      <p className="mt-1 text-[11.5px] text-black/40">
                        {new Date(report.createdAt).toLocaleDateString("es", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        {report.aiModel ? ` · ${report.aiModel}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-[12px] text-black/50">{STATUS_LABELS[report.status] ?? report.status}</span>
                      <ArrowUpRight className="h-4 w-4 text-black/30" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}