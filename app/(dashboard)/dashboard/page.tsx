import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  FileBarChart2,
  Zap,
  ClipboardList,
  UserCircle,
  Settings,
  ArrowUpRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getDashboardStats, getUserTestAttempts } from "@/_actions/dashbaord";
import { QuickAction } from "../_componets/quick-actions";
import { ProfileValuesStrengths } from "@/app/components/tests/profile-values-strengths";
import { getProfileValuesStrengths } from "@/_actions/profile";
import { getMinorProfiles } from "@/_actions/minor-profiles";
import { MinorProfilesSection } from "../_componets/minor-profiles-section";
import { ReadinessRequirement, TestReadinessTab } from "../_componets/TestReadinessFAB";
import { DashboardProductTour } from "../_componets/dashboard-product-tour";

const ACCENT = "#FF5A1F";

const STATUS_STYLES: Record<string, { label: string; dot: string; text: string }> = {
  completed: { label: "Completado", dot: "bg-emerald-500", text: "text-emerald-700" },
  in_progress: { label: "En progreso", dot: "", text: "" }, // orange, set inline below
  not_started: { label: "No iniciado", dot: "bg-black/20", text: "text-black/40" },
  abandoned: { label: "Abandonado", dot: "bg-black/20", text: "text-black/40" },
};

export default async function DashboardPage() {
  const [statsResult, attemptsResult, valuesResult, minorsResult] = await Promise.all([
    getDashboardStats(),
    getUserTestAttempts(),
    getProfileValuesStrengths(),
    getMinorProfiles(),
  ]);

    const values = valuesResult.success ? valuesResult.data.values : [];
  const strengths = valuesResult.success ? valuesResult.data.strengths : [];

  const stats = statsResult.success
    ? statsResult.data
    : { testsCompleted: 0, inProgress: 0, reportsReady: 0, creditsUsed: 0 };

  const attempts = attemptsResult.success ? attemptsResult.data : [];

  const requirements: ReadinessRequirement[] = [
  // {
  //   id: "profile",
  //   label: "Detalles del perfil",
  //   description: "Nombre, edad, ciudad y foto de perfil.",
  //   href: "/profile",
  //   met: Boolean(user.name && user.age && user.city && user.avatarUrl),
  // },
  {
    id: "values-strengths",
    label: "Valores y fortalezas",
    description: "Selecciona al menos un valor y una fortaleza.",
    href: "/profile#values-strengths",
    met: values.length > 14 && strengths.length > 12,
  },
];

<TestReadinessTab requirements={requirements} />

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-8 sm:py-9">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[.18em] text-[#e46a12]">Tu espacio personal</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#141b3c]">Panel</h1>
        </div>
        <DashboardProductTour />
        {/* <p className="mt-1 text-[13px] text-black/45">
          Una vista general de tus pruebas, informes y uso de créditos de IA.
        </p> */}
      </div>

      {/* ── Telemetry ─────────────────────────────────────── */}
      {/* <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          icon={CheckCircle2}
          label="Pruebas completadas"
          value={stats.testsCompleted}
        />
        <StatCard
          icon={Clock}
          label="En progreso"
          value={stats.inProgress}
          highlight={stats.inProgress > 0}
        />
        <StatCard
          icon={FileBarChart2}
          label="Informes listos"
          value={stats.reportsReady}
        />
        <StatCard
          icon={Zap}
          label="Créditos de IA usados"
          value={stats.creditsUsed.toFixed(1)}
        />
      </div> */}

      {/* ── Quick actions ─────────────────────────────────── */}
     <div className="mb-10">
  <h2 className="text-lg font-bold text-[#141b3c]">
    Acciones rápidas
  </h2>
  <p className="mt-1 text-sm text-[#545c7e]">
    Lo que harás con más frecuencia, a un toque de distancia.
  </p>

  <div id="dashboard-quick-actions" className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
    <QuickAction href="/tests" icon={ClipboardList} label="Realizar prueba" />
    <QuickAction href="/reports" icon={FileBarChart2} label="Ver informes" />
    <QuickAction href="/settings" icon={UserCircle} label="Actualizar perfil" />
    <QuickAction href="/settings" icon={Settings} label="Configuración" />
  </div>
</div>

      <MinorProfilesSection
        profiles={minorsResult.success ? minorsResult.data : []}
        loadError={minorsResult.success ? null : minorsResult.error}
      />
      


      <div id="dashboard-values" className="mt-6 rounded-[26px] border border-[#141b3c]/10 bg-white p-5 shadow-[0_16px_45px_-36px_rgba(20,27,60,.5)] sm:p-7">
  <div className="mb-6">
    <h2 className="text-lg font-bold text-[#141b3c]">
      Valores y fortalezas
    </h2>
    <p className="mt-1 text-sm text-[#545c7e]">
      Complétalos antes de poder realizar una prueba.
    </p>
  </div>

  <ProfileValuesStrengths
    initialValues={values}
    initialStrengths={strengths}
  />
</div>

              {/* ── Attempts table ────────────────────────────────── */}
      <div id="dashboard-attempts" className="mt-7">
        <h2 className="mb-3 text-lg font-bold text-[#141b3c]">Tus intentos de prueba</h2>

        {attempts.length === 0 ? (
          <div className="rounded-[26px] border border-[#141b3c]/10 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-sm text-[#545c7e]">
              Aún no has empezado una prueba.
            </p>
            <Link
              href="/tests"
              className="mt-4 inline-flex items-center gap-1 rounded-full bg-[#f27a1a] px-4 py-2.5 text-sm font-semibold text-[#141b3c] shadow-[3px_3px_0_#141b3c]"
              style={{ color: ACCENT }}
            >
              Explorar pruebas <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[26px] border border-[#141b3c]/10 bg-white shadow-sm">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[#141b3c]/10 bg-[#fff8f2] text-left">
                  <Th>Prueba</Th>
                  <Th>Estado</Th>
                  <Th>Puntuación</Th>
                  <Th>Iniciado</Th>
                  <Th>Finalizado</Th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => {
                  const style = STATUS_STYLES[a.status];
                  const isInProgress = a.status === "in_progress";
                  return (
                    <tr
                      key={a.id}
                      className="border-b border-[#141b3c]/5 last:border-0 hover:bg-[#fffaf5]"
                    >
                      <Td className="font-medium text-black">{a.testTitle}</Td>
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
                      <Td className="text-black/45">{formatDate(a.completedAt)}</Td>
                     
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

function StatCard({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-lg border border-black/[0.08] bg-white px-4 py-4 transition-shadow duration-300 hover:shadow-[inset_0_0_0_1px_var(--accent)]"
      style={{ "--accent": ACCENT } as React.CSSProperties}
    >
      <div
        className="mb-3 flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-300"
        style={{ backgroundColor: highlight ? ACCENT : "rgba(0,0,0,0.04)" }}
      >
        <Icon
          className={cn(
            "h-4 w-4 transition-colors duration-300",
            highlight ? "text-white" : "text-black/50 group-hover:text-[var(--accent)]"
          )}
        />
      </div>

      <div className="text-[20px] font-semibold text-black tabular-nums">{value}</div>
      <div className="mt-0.5 text-[12px] text-black/45">{label}</div>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 bottom-0 h-px origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
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