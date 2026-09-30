"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getReportStatus } from "@/_actions/report-status";
import { cn } from "@/lib/utils";

const ACCENT = "#FF5A1F";

const STEPS = [
  { label: "Recibiendo tus respuestas", after: 0 },
  { label: "Analizando tu perfil", after: 0.25 },
  { label: "Redactando tu informe", after: 0.6 },
  { label: "Cerrando tu documento", after: 0.9 },
];

/**
 * Waiting screen shown while the report is being generated.
 *
 * - Fast first check (1.5s) so reports that were already done feel instant.
 * - Backs off up to 8s so a long generation does not hammer the server.
 * - Resolves as soon as the status leaves pending/generating and triggers a
 *   refresh, so the finished report renders without a manual reload.
 */
export function ReportGenerating({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Elapsed timer doubles as the progress driver.
  useEffect(() => {
    const started = Date.now();
    const id = window.setInterval(() => setElapsed(Date.now() - started), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let delay = 1500;

    const check = async () => {
      try {
        const res = await getReportStatus(reportId);
        if (cancelled) return;

        if (res.success && res.status !== "pending" && res.status !== "generating") {
          setDone(true);
          // Pull the finished report from the server.
          setTimeout(() => router.refresh(), 700);
          return;
        }
      } catch {
        // Keep polling — a transient failure should not end the wait.
      }

      if (cancelled) return;
      delay = Math.min(delay * 1.4, 8000);
      timeoutRef.current = setTimeout(check, delay);
    };

    timeoutRef.current = setTimeout(check, delay);

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [reportId, router]);

  const seconds = Math.floor(elapsed / 1000);
  const progress = Math.min(96, 8 + seconds * 2.2);
  const activeStep = Math.min(
    STEPS.length - 1,
    STEPS.filter((s) => progress / 100 >= s.after).length - 1
  );

  return (
    <div className="rounded-2xl border-black/[0.06] bg-white px-6 py-14 sm:px-10">
      <div className="mx-auto max-w-md text-center">
        <div className="relative mx-auto mb-6 h-16 w-16">
          <span
            className="absolute inset-0 animate-ping rounded-2xl opacity-20"
            style={{ backgroundColor: ACCENT }}
          />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: ACCENT }} />
          </span>
        </div>

        <h1 className="text-[17px] font-semibold tracking-[-0.01em] text-black">
          {done ? "¡Tu informe ya está listo!" : "Estamos preparando tu informe"}
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-black/45">
          {done
            ? "Cargando tu documento…"
            : "Esto toma entre 1 y 3 minutos. Podés cerrar esta página: te avisamos por notificación apenas esté."}
        </p>

        <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={{ width: `${done ? 100 : progress}%`, backgroundColor: ACCENT }}
          />
        </div>

        <ul className="mt-6 space-y-2.5 text-left">
          {STEPS.map((step, i) => {
            const state: "done" | "active" | "todo" =
              done || i < activeStep ? "done" : i === activeStep ? "active" : "todo";
            return (
              <li
                key={step.label}
                className={cn(
                  "flex items-center gap-2.5 text-[12.5px] transition-colors",
                  state === "todo" ? "text-black/30" : "text-black/70"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px]",
                    state === "done" && "border-transparent text-white",
                    state === "active" && "border-transparent animate-pulse"
                  )}
                  style={state !== "todo" ? { backgroundColor: ACCENT } : undefined}
                >
                  {state === "active" ? <Loader2 className="h-2.5 w-2.5 animate-spin text-white" /> : state === "done" ? "✓" : ""}
                </span>
                {step.label}
              </li>
            );
          })}
        </ul>

        <p className="mt-7 text-[11.5px] text-black/30">
          {seconds < 60 ? `Transcurridos ${seconds}s` : `Transcurridos ${Math.floor(seconds / 60)}m ${seconds % 60}s`}
        </p>
      </div>
    </div>
  );
}
