"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReadinessRequirement {
  id: string;
  label: string;
  description?: string;
  href: string;
  met: boolean;
}

export function TestReadinessTab({
  requirements,
}: {
  requirements: ReadinessRequirement[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const completed = requirements.filter((r) => r.met).length;
  const total = requirements.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const ready = total > 0 && completed === total;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} className="fixed right-5 top-24 z-50 flex flex-col items-end">
      {/* Tab */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 rounded-full border bg-white py-2 pl-2 pr-3 shadow-sm transition-all duration-300 hover:shadow-md",
          ready ? "border-orange-200" : "border-black/[0.08]"
        )}
      >
        <ProgressRing percent={percent} ready={ready} />
        <span className="text-[12px] font-medium text-black/70">
          {ready ? "Listo" : `${completed}/${total}`}
        </span>
      </button>

      {/* Hanging thread */}
      <div
        className={cn(
          "w-px bg-black/10 transition-all duration-300 ease-out",
          open ? "h-3 opacity-100" : "h-0 opacity-0"
        )}
        aria-hidden
      />

      {/* Hanging card */}
      <div
        className={cn(
          "w-72 origin-top overflow-hidden rounded-lg border border-black/[0.08] bg-white shadow-lg transition-all duration-300 ease-out",
          open
            ? "max-h-[28rem] scale-100 opacity-100"
            : "pointer-events-none max-h-0 scale-95 opacity-0"
        )}
      >
        <div className="border-b border-black/[0.06] p-4">
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-black/40" strokeWidth={1.5} />
            <h3 className="text-[13px] font-medium text-black/85">
              Preparación para la prueba
            </h3>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-2 text-[12px] text-black/45">
            {ready
              ? "Cumples todos los requisitos."
              : `${completed} de ${total} requisitos completados.`}
          </p>
        </div>

        <ul className="divide-y divide-black/[0.06]">
          {requirements.map((req) => (
            <li key={req.id} className="flex items-start gap-3 p-4">
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                  req.met
                    ? "border-transparent bg-gradient-to-br from-orange-500 to-orange-600"
                    : "border-black/15 bg-white"
                )}
              >
                {req.met && <Check className="h-3 w-3 text-white" strokeWidth={2.5} />}
              </span>

              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-[13px] font-medium",
                    req.met
                      ? "text-black/45 line-through decoration-black/20"
                      : "text-black/85"
                  )}
                >
                  {req.label}
                </p>
                {req.description && !req.met && (
                  <p className="mt-0.5 text-[12px] text-black/45">{req.description}</p>
                )}
                {!req.met && (
                  <Link
                    href={req.href}
                    className="mt-1.5 inline-block text-[12px] font-medium text-orange-600 transition-colors hover:text-orange-700"
                  >
                    Completar
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ProgressRing({ percent, ready }: { percent: number; ready: boolean }) {
  const size = 22;
  const stroke = 2.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <span className="relative flex h-[22px] w-[22px] shrink-0 items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ready ? "#ea580c" : "#f97316"}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {ready && <Check className="absolute h-3 w-3 text-orange-600" strokeWidth={3} />}
    </span>
  );
}