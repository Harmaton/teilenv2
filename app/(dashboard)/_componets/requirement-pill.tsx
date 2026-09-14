"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // swap for `react-router-dom` Link if not Next.js
import {
  Check,
  ChevronRight,
  Circle,
  Sparkles,
  X,
  User,
  Compass,
} from "lucide-react"; // or any icon lib; swap for inline SVGs if preferred

export type Requirement = {
  id: string;
  label: string;
  description?: string;
  done: boolean;
  href: string;
  ctaLabel?: string;
};

type Props = {
  /** Requirements to display */
  requirements: Requirement[];
  /** Optional: called when the user clicks the final "Get report" button */
  onGenerateReport?: () => void;
  /** Optional: whether the report is already unlocked (hides pill) */
  reportUnlocked?: boolean;
};

export default function ReportRequirementsPill({
  requirements,
  onGenerateReport,
  reportUnlocked = false,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // slight delay so the enter transition plays
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Don't render anything once the report is available
  if (reportUnlocked) return null;

  const total = requirements.length;
  const completed = requirements.filter((r) => r.done).length;
  const allDone = completed === total;
  const pct = total === 0 ? 100 : Math.round((completed / total) * 100);

  return (
    <div
      className={[
        "fixed right-4 top-1/2 z-50 -translate-y-1/2",
        "transition-all duration-500 ease-out",
        mounted
          ? "translate-x-0 opacity-100"
          : "translate-x-6 opacity-0",
      ].join(" ")}
    >
      {/* Collapsed pill */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={[
            "group flex items-center gap-3 rounded-full",
            "bg-white/90 backdrop-blur-md shadow-lg ring-1 ring-black/5",
            "pl-3 pr-4 py-2.5 hover:shadow-xl hover:scale-[1.02]",
            "transition-all duration-200",
          ].join(" ")}
          aria-label="Show report requirements"
        >
          {/* Progress ring */}
          <ProgressRing pct={pct} />

          <span className="flex flex-col items-start leading-tight">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Report
            </span>
            <span className="text-sm font-semibold text-slate-900">
              {allDone
                ? "Ready to generate"
                : `${completed}/${total} requirements`}
            </span>
          </span>

          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>
      )}

      {/* Expanded card */}
      {open && (
        <div
          className={[
            "w-[340px] max-w-[calc(100vw-2rem)]",
            "rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl ring-1 ring-black/5",
            "overflow-hidden",
            "animate-in fade-in slide-in-from-right-2 duration-300",
          ].join(" ")}
        >
          {/* Header */}
          <div className="flex items-start gap-3 p-4 pb-3 border-b border-slate-100">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-2 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-slate-900">
                Unlock your report
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {allDone
                  ? "You're all set — generate it now."
                  : `Complete ${total - completed} more ${
                      total - completed === 1 ? "step" : "steps"
                    } to continue.`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-4 pt-3">
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Requirements list */}
          <ul className="p-3 space-y-1.5">
            {requirements.map((req) => (
              <RequirementRow key={req.id} req={req} />
            ))}
          </ul>

          {/* Footer CTA */}
          <div className="p-3 pt-0">
            <button
              type="button"
              disabled={!allDone}
              onClick={onGenerateReport}
              className={[
                "w-full rounded-xl px-4 py-2.5 text-sm font-semibold",
                "transition-all duration-200",
                allDone
                  ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow-md"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed",
              ].join(" ")}
            >
              {allDone ? "Generate my report" : "Complete steps to continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------- helpers ------------------------------- */

function RequirementRow({ req }: { req: Requirement }) {
  const Icon = req.id.includes("values") ? Compass : User;

  return (
    <li>
      <Link
        href={req.href}
        className={[
          "flex items-center gap-3 rounded-xl px-3 py-2.5",
          "transition-colors group",
          req.done
            ? "hover:bg-emerald-50/60"
            : "hover:bg-slate-50 ring-1 ring-transparent hover:ring-slate-100",
        ].join(" ")}
      >
        {/* Status indicator */}
        <span
          className={[
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
            req.done
              ? "bg-emerald-500 text-white"
              : "bg-slate-100 text-slate-400 ring-1 ring-slate-200",
          ].join(" ")}
        >
          {req.done ? (
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          ) : (
            <Circle className="h-2.5 w-2.5 fill-current" />
          )}
        </span>

        {/* Labels */}
        <span className="flex-1 min-w-0">
          <span
            className={[
              "flex items-center gap-1.5 text-sm font-medium",
              req.done
                ? "text-slate-500 line-through decoration-slate-300"
                : "text-slate-900",
            ].join(" ")}
          >
            <Icon className="h-3.5 w-3.5 text-slate-400" />
            {req.label}
          </span>
          {req.description && !req.done && (
            <span className="block text-xs text-slate-500 mt-0.5 truncate">
              {req.description}
            </span>
          )}
        </span>

        {/* CTA / chevron */}
        {!req.done ? (
          <span className="shrink-0 rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-600 group-hover:bg-indigo-100 transition-colors">
            {req.ctaLabel ?? "Start"}
          </span>
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-300" />
        )}
      </Link>
    </li>
  );
}

function ProgressRing({ pct }: { pct: number }) {
  const size = 36;
  const stroke = 3.5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <span className="relative inline-flex">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgb(226 232 240)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
        <defs>
          <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-700">
        {pct}%
      </span>
    </span>
  );
}