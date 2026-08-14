
import Link from "next/link";
import {
  Users,
  UserPlus,
  Activity,
  TrendingDown,
  ClipboardList,
  CalendarClock,
  CheckCircle2,
  FileBarChart2,
  Sparkles,
  Zap,
  ArrowUpRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  getAdminDashboardStats,
  getDailyAttemptsTrend,
  getTopTests,
  getRecentAttemptsAdmin,
} from "@/_actions/admin-dashboard";

const ACCENT = "#FF5A1F";

const STATUS_STYLES: Record<string, { label: string; dot: string; text: string }> = {
  completed: { label: "Completado", dot: "bg-emerald-500", text: "text-emerald-700" },
  in_progress: { label: "En progreso", dot: "", text: "" }, // orange, set inline below
  not_started: { label: "No iniciado", dot: "bg-black/20", text: "text-black/40" },
  abandoned: { label: "Abandonado", dot: "bg-black/20", text: "text-black/40" },
};

export default async function AdminDashboardPage() {
  const [statsResult, trendResult, topTestsResult, attemptsResult] = await Promise.all([
    getAdminDashboardStats(),
    getDailyAttemptsTrend(14),
    getTopTests(5),
    getRecentAttemptsAdmin(10),
  ]);

  if (!statsResult.success) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <p className="text-[13px] text-black/45">{statsResult.error}</p>
      </div>
    );
  }

  const stats = statsResult.data;
  const trend = trendResult.success ? trendResult.data : [];
  const topTests = topTestsResult.success ? topTestsResult.data : [];
  const attempts = attemptsResult.success ? attemptsResult.data : [];
  const maxTrend = Math.max(1, ...trend.map((p) => p.attempts));

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-black">Panel de administración</h1>
        <p className="mt-1 text-[13px] text-black/45">
          Usuarios, actividad de pruebas e informes de IA en toda la plataforma.
        </p>
      </div>

      {/* ── Usuarios ──────────────────────────────────────── */}
      {/* <SectionLabel>Usuarios</SectionLabel>
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={Users} label="Usuarios totales" value={stats.totalUsers} />
        <StatCard icon={UserPlus} label="Nuevos esta semana" value={stats.newUsersThisWeek} sub={`+${stats.newUsersToday} hoy`} />
        <StatCard icon={Activity} label="Activos (7 días)" value={stats.activeUsers7d} highlight />
        <StatCard
          icon={TrendingDown}
          label="Tasa de abandono"
          value={`${stats.churnRate.toFixed(1)}%`}
          warn={stats.churnRate > 30}
        />
      </div> */}

      {/* ── Pruebas ───────────────────────────────────────── */}
      <SectionLabel>Pruebas</SectionLabel>
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={ClipboardList} label="Intentos totales" value={stats.totalAttempts} />
        <StatCard icon={CalendarClock} label="Intentos hoy" value={stats.attemptsToday} highlight={stats.attemptsToday > 0} />
        <StatCard icon={Activity} label="En progreso" value={stats.inProgressAttempts} />
        <StatCard icon={CheckCircle2} label="Tasa de finalización" value={`${stats.completionRate.toFixed(1)}%`} />
      </div>

      {/* ── Informes & IA ─────────────────────────────────── */}
      <SectionLabel>Informes &amp; IA</SectionLabel>
      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={FileBarChart2} label="Informes completados" value={stats.reportsCompleted} />
        <StatCard icon={Sparkles} label="Tasa de generación" value={`${stats.reportGenerationRate.toFixed(1)}%`} />
        <StatCard icon={Zap} label="Créditos de IA usados" value={stats.totalCreditsUsed.toFixed(1)} sub={`${stats.creditsUsedToday.toFixed(1)} hoy`} />
        <StatCard
          icon={FileBarChart2}
          label="Informes pendientes / fallidos"
          value={`${stats.reportsPending} / ${stats.reportsFailed}`}
          warn={stats.reportsFailed > 0}
        />
      </div>

      {/* ── Trend + Top tests ─────────────────────────────── */}
      <div className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 text-[13px] font-semibold text-black">Intentos por día (últimos 14 días)</h2>
          <div className="flex h-32 items-end gap-1.5">
            {trend.map((p) => (
              <div key={p.date} className="group relative flex-1" title={`${p.date}: ${p.attempts}`}>
                <div
                  className="w-full rounded-t-sm transition-colors group-hover:opacity-80"
                  style={{
                    height: `${Math.max(4, (p.attempts / maxTrend) * 100)}%`,
                    backgroundColor: p.attempts > 0 ? ACCENT : "rgba(0,0,0,0.06)",
                  }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10.5px] text-black/35">
            <span>{trend[0]?.date}</span>
            <span>{trend[trend.length - 1]?.date}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <h2 className="mb-4 text-[13px] font-semibold text-black">Pruebas más populares</h2>
          <div className="space-y-3">
            {topTests.length === 0 ? (
              <p className="text-[12.5px] text-black/40">Sin datos aún.</p>
            ) : (
              topTests.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3">
                  <span className="truncate text-[12.5px] font-medium text-black">{t.title}</span>
                  <span className="shrink-0 text-[12px] text-black/45">
                    {t.attempts} · {t.completionRate.toFixed(0)}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Recent attempts across all users ─────────────── */}
      <div>
        <h2 className="mb-3 text-[15px] font-semibold text-black">Intentos recientes</h2>

        {attempts.length === 0 ? (
          <div className="rounded-2xl border border-black/[0.06] bg-black/[0.02] px-6 py-10 text-center">
            <p className="text-[13px] text-black/45">Aún no hay intentos registrados.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-black/[0.06]">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-black/[0.06] bg-black/[0.02] text-left">
                  <Th>Usuario</Th>
                  <Th>Prueba</Th>
                  <Th>Estado</Th>
                  <Th>Puntuación</Th>
                  <Th>Iniciado</Th>
                  <Th align="right">Informe</Th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => {
                  const style = STATUS_STYLES[a.status];
                  const isInProgress = a.status === "in_progress";
                  return (
                    <tr key={a.id} className="border-b border-black/[0.04] last:border-0 hover:bg-black/[0.015]">
                      <Td>
                        <div className="font-medium text-black">{a.userName}</div>
                        <div className="text-[11.5px] text-black/40">{a.userEmail}</div>
                      </Td>
                      <Td className="text-black/70">{a.testTitle}</Td>
                      <Td>
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className={cn("h-1.5 w-1.5 rounded-full", style.dot)}
                            style={isInProgress ? { backgroundColor: ACCENT } : undefined}
                          />
                          <span
                            className={cn("text-[12.5px]", style.text)}
                            style={isInProgress ? { color: ACCENT } : undefined}
                          >
                            {style.label}
                          </span>
                        </span>
                      </Td>
                      <Td>{a.score !== null ? a.score : "—"}</Td>
                      <Td className="text-black/45">{formatDate(a.startedAt)}</Td>
                      <Td align="right">
                        {a.hasReport ? (
                          <Link
                            href={`/admin/reports/${a.id}`}
                            className="inline-flex items-center gap-1 font-medium"
                            style={{ color: ACCENT }}
                          >
                            Ver <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="text-black/25">—</span>
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-black/35">
      {children}
    </h2>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  highlight = false,
  warn = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white px-4 py-4">
      <div
        className="mb-3 flex h-8 w-8 items-center justify-center rounded-full"
        style={{
          backgroundColor: warn ? "#DC2626" : highlight ? ACCENT : "rgba(0,0,0,0.04)",
        }}
      >
        <Icon className={cn("h-4 w-4", warn || highlight ? "text-white" : "text-black/50")} />
      </div>
      <div className="text-[20px] font-semibold text-black">{value}</div>
      <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-black/45">
        <span>{label}</span>
        {sub && <span className="text-black/30">· {sub}</span>}
      </div>
    </div>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      className={cn(
        "px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-black/35",
        align === "right" && "text-right"
      )}
    >
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
  return (
    <td className={cn("px-4 py-3", align === "right" && "text-right", className)}>
      {children}
    </td>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es", { month: "short", day: "numeric" });
}