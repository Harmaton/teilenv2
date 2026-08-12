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

const ACCENT = "#FF5A1F";

const STATUS_STYLES: Record<string, { label: string; dot: string; text: string }> = {
  completed: { label: "Completed", dot: "bg-emerald-500", text: "text-emerald-700" },
  in_progress: { label: "In progress", dot: "", text: "" }, // orange, set inline below
  not_started: { label: "Not started", dot: "bg-black/20", text: "text-black/40" },
  abandoned: { label: "Abandoned", dot: "bg-black/20", text: "text-black/40" },
};

export default async function DashboardPage() {
  const [statsResult, attemptsResult] = await Promise.all([
    getDashboardStats(),
    getUserTestAttempts(),
  ]);

  const stats = statsResult.success
    ? statsResult.data
    : { testsCompleted: 0, inProgress: 0, reportsReady: 0, creditsUsed: 0 };

  const attempts = attemptsResult.success ? attemptsResult.data : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-black">Dashboard</h1>
        <p className="mt-1 text-[13px] text-black/45">
          A snapshot of your tests, reports, and AI credit usage.
        </p>
      </div>

      {/* ── Telemetry ─────────────────────────────────────── */}
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          icon={CheckCircle2}
          label="Tests completed"
          value={stats.testsCompleted}
        />
        <StatCard
          icon={Clock}
          label="In progress"
          value={stats.inProgress}
          highlight={stats.inProgress > 0}
        />
        <StatCard
          icon={FileBarChart2}
          label="Reports ready"
          value={stats.reportsReady}
        />
        <StatCard
          icon={Zap}
          label="AI credits used"
          value={stats.creditsUsed.toFixed(1)}
        />
      </div>

      {/* ── Quick actions ─────────────────────────────────── */}
      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <QuickAction href="/tests" icon={ClipboardList} label="Take a test" />
        <QuickAction href="/reports" icon={FileBarChart2} label="View reports" />
        <QuickAction href="/profile" icon={UserCircle} label="Update profile" />
        <QuickAction href="/settings" icon={Settings} label="Settings" />
      </div>

      {/* ── Attempts table ────────────────────────────────── */}
      <div>
        <h2 className="mb-3 text-[15px] font-semibold text-black">Your test attempts</h2>

        {attempts.length === 0 ? (
          <div className="rounded-2xl border border-black/[0.06] bg-black/[0.02] px-6 py-10 text-center">
            <p className="text-[13px] text-black/45">
              You haven&rsquo;t started a test yet.
            </p>
            <Link
              href="/tests"
              className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium"
              style={{ color: ACCENT }}
            >
              Browse tests <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-black/[0.06]">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-black/[0.06] bg-black/[0.02] text-left">
                  <Th>Test</Th>
                  <Th>Status</Th>
                  <Th>Score</Th>
                  <Th>Started</Th>
                  <Th>Completed</Th>
                  <Th align="right">Report</Th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => {
                  const style = STATUS_STYLES[a.status];
                  const isInProgress = a.status === "in_progress";
                  return (
                    <tr
                      key={a.id}
                      className="border-b border-black/[0.04] last:border-0 hover:bg-black/[0.015]"
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
                      <Td align="right">
                        {a.hasReport ? (
                          <Link
                            href={`/reports/${a.id}`}
                            className="inline-flex items-center gap-1 font-medium"
                            style={{ color: ACCENT }}
                          >
                            View <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        ) : isInProgress ? (
                          <Link
                            href={`/tests/${a.id}`}
                            className="font-medium text-black/70 hover:text-black"
                          >
                            Continue
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
    <div className="rounded-2xl border border-black/[0.06] bg-white px-4 py-4">
      <div
        className="mb-3 flex h-8 w-8 items-center justify-center rounded-full"
        style={{
          backgroundColor: highlight ? ACCENT : "rgba(0,0,0,0.04)",
        }}
      >
        <Icon className={cn("h-4 w-4", highlight ? "text-white" : "text-black/50")} />
      </div>
      <div className="text-[20px] font-semibold text-black">{value}</div>
      <div className="mt-0.5 text-[12px] text-black/45">{label}</div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2.5 rounded-2xl border border-black/[0.06] bg-white px-4 py-3.5 transition-colors hover:border-black/[0.12]"
    >
      <Icon className="h-4 w-4 text-black/40 transition-colors group-hover:text-black/70" />
      <span className="text-[13px] font-medium text-black/70 group-hover:text-black">
        {label}
      </span>
    </Link>
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
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}