"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { UserRow } from "@/_actions/admin-users";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

export function AdminUsersTable({ users }: { users: UserRow[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const matchingUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    if (!normalizedQuery) return users;
    return users.filter((user) => (user.fullName ?? "").toLocaleLowerCase("es").includes(normalizedQuery));
  }, [query, users]);
  const pageCount = Math.max(1, Math.ceil(matchingUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleUsers = matchingUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const firstResult = matchingUsers.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastResult = Math.min(currentPage * PAGE_SIZE, matchingUsers.length);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <label className="relative block w-full sm:max-w-xs">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
          <span className="sr-only">Buscar usuarios por nombre</span>
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
          {matchingUsers.length} {matchingUsers.length === 1 ? "usuario" : "usuarios"}
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/[0.06]">
        <table className="w-full min-w-[760px] border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-black/[0.06] bg-black/[0.02] text-left">
              <Th>Nombre</Th>
              <Th>Correo</Th>
              <Th>Rol</Th>
              <Th>Estado</Th>
              <Th>Registrado</Th>
              <Th align="right">Última actividad</Th>
            </tr>
          </thead>
          <tbody>
            {visibleUsers.map((user) => (
              <tr key={user.id} className="border-b border-black/[0.04] last:border-0 hover:bg-black/[0.015]">
                <Td className="font-medium text-black">{user.fullName ?? "—"}</Td>
                <Td className="text-black/60">{user.email}</Td>
                <Td className="text-black/60">{user.role}</Td>
                <Td>
                  <span className={cn("text-[12px]", user.isActive ? "text-emerald-700" : "text-black/35")}>
                    {user.isActive ? "Activo" : "Inactivo"}
                  </span>
                </Td>
                <Td className="text-black/45">{formatDate(user.createdAt)}</Td>
                <Td align="right" className="text-black/45">
                  {user.lastAttemptAt ? formatDate(user.lastAttemptAt) : "—"}
                </Td>
              </tr>
            ))}
            {visibleUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[13px] text-black/45">
                  {query.trim() ? "No se encontraron usuarios con ese nombre." : "Todavía no hay usuarios."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        first={firstResult}
        last={lastResult}
        total={matchingUsers.length}
        page={currentPage}
        pages={pageCount}
        onPageChange={setPage}
      />
    </div>
  );
}

function Pagination({
  first,
  last,
  total,
  page,
  pages,
  onPageChange,
}: {
  first: number;
  last: number;
  total: number;
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
      <p className="text-[12px] text-black/45">Mostrando {first}–{last} de {total}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-black/[0.08] px-3 text-[12px] text-black/70 transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Anterior
        </button>
        <span className="min-w-16 text-center text-[12px] text-black/55">{page} / {pages}</span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          aria-label="Página siguiente"
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-black/[0.08] px-3 text-[12px] text-black/70 transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th className={cn("px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-black/35", align === "right" && "text-right")}>
      {children}
    </th>
  );
}

function Td({
  children,
  className,
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}) {
  return <td className={cn("px-4 py-3", align === "right" && "text-right", className)}>{children}</td>;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es", { month: "short", day: "numeric" });
}
