"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { UserReportGroup } from "@/_actions/admin-reports";

const PAGE_SIZE = 8;

const STATUS_LABELS: Record<string, string> = {
  completed: "Completado",
  generating: "Generando",
  pending: "Pendiente",
  failed: "Fallido",
};

export function AdminReportsList({ groups }: { groups: UserReportGroup[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const matchingGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    if (!normalizedQuery) return groups;
    return groups.filter((group) => (group.fullName ?? "").toLocaleLowerCase("es").includes(normalizedQuery));
  }, [groups, query]);
  const pageCount = Math.max(1, Math.ceil(matchingGroups.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleGroups = matchingGroups.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const firstResult = matchingGroups.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastResult = Math.min(currentPage * PAGE_SIZE, matchingGroups.length);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <label className="relative block w-full sm:max-w-xs">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
          <span className="sr-only">Buscar informes por nombre de usuario</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nombre…"
            className="h-10 w-full rounded-xl border border-black/[0.08] bg-white pl-9 pr-3 text-[13px] outline-none transition focus:border-[#FF5A1F]/50 focus:ring-2 focus:ring-[#FF5A1F]/10"
          />
        </label>
        <p className="text-[12px] text-black/45" aria-live="polite">
          {matchingGroups.length} {matchingGroups.length === 1 ? "usuario con informes" : "usuarios con informes"}
        </p>
      </div>

      {visibleGroups.length === 0 ? (
        <div className="rounded-2xl border border-black/[0.06] bg-white px-6 py-12 text-center text-[13px] text-black/45">
          {query.trim() ? "No se encontraron informes para ese nombre." : "Todavía no hay informes."}
        </div>
      ) : (
        <div className="space-y-5">
          {visibleGroups.map((group) => (
            <section key={group.profileId} className="rounded-2xl border border-black/[0.08] bg-white p-5">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-[15px] font-semibold text-black">{group.fullName ?? "Usuario sin nombre"}</h2>
                  <p className="mt-1 text-[12px] text-black/45">{group.email ?? "Sin correo"}</p>
                </div>
                <span className="rounded-full bg-[#FF5A1F]/[0.08] px-2.5 py-1 text-[11px] font-medium text-[#C94A1B]">
                  {group.reports.length} {group.reports.length === 1 ? "informe" : "informes"}
                </span>
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] text-black/45" aria-live="polite">Mostrando {firstResult}–{lastResult} de {matchingGroups.length} usuarios</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Página anterior"
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-black/[0.08] px-3 text-[12px] text-black/70 transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>
          <span className="min-w-16 text-center text-[12px] text-black/55">{currentPage} / {pageCount}</span>
          <button
            type="button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= pageCount}
            aria-label="Página siguiente"
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-black/[0.08] px-3 text-[12px] text-black/70 transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}
