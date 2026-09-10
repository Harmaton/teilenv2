"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Loader2, Sparkles, Compass, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  startAttempt,
  saveAttemptProgress,
  submitAttempt,
  type TestDetail,
  type AttemptState,
  type TestItem,
} from "@/_actions/test-attempts";

const ENCOURAGEMENTS = [
  "Empieza por lo primero que te venga a la mente.",
  "No hay respuestas perfectas. Hay respuestas honestas.",
  "Vas encontrando tu manera de pensar.",
  "Tómate un segundo: tu primera reacción también cuenta.",
  "Sigue a tu ritmo. Esto es para conocerte mejor.",
];

function getEncouragement(step: number, total: number) {
  const progress = total > 0 ? step / total : 0;
  if (progress >= 0.8) return "Ya casi. Mira lo que aparece cuando respondes con honestidad.";
  if (progress >= 0.5) return "Vas muy bien. Cada respuesta suma una pista sobre ti.";
  return ENCOURAGEMENTS[step % ENCOURAGEMENTS.length];
}

export function TestRunner({
  test,
  attempt: initialAttempt,
}: {
  test: TestDetail;
  attempt: AttemptState | null;
}) {
  const router = useRouter();
  const [attempt, setAttempt] = useState(initialAttempt);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>(
    initialAttempt?.answers ?? {}
  );
  const [isPending, startTransition] = useTransition();
  const [startError, setStartError] = useState<string | null>(null);

  const items: TestItem[] = attempt?.itemsSnapshot ?? test.items;

  // ── Not started yet ─────────────────────────────────────
  if (!attempt) {
    return (
      <div className="relative overflow-hidden rounded-[28px] border border-orange-100 bg-[#fffaf5] p-7 text-center shadow-[0_18px_50px_-32px_rgba(255,90,31,0.65)] sm:p-10">
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange-100/70" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-sky-100/70" />
        <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white rotate-3">
          <Compass className="h-7 w-7 -rotate-3" />
        </div>
        <p className="relative mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-600">Un espacio para ti</p>
        <h1 className="relative text-[22px] font-semibold tracking-[-0.02em] text-slate-950 sm:text-[26px]">{test.title}</h1>
        {test.description && (
          <p className="relative mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-slate-600">
            {test.description}
          </p>
        )}
        <div className="relative mx-auto mt-6 max-w-sm rounded-2xl border border-orange-100 bg-white/80 px-4 py-3 text-left">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
            <p className="text-[13px] leading-relaxed text-slate-600">No tienes que demostrar nada. Solo responde como eres hoy.</p>
          </div>
        </div>
        {startError && <p className="relative mt-4 text-[12px] text-red-600">{startError}</p>}
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const res = await startAttempt(test.id);
              if (res.success) {
                setAttempt({
                  id: res.attemptId,
                  status: "in_progress",
                  answers: {},
                  itemsSnapshot: test.items,
                });
              } else {
                setStartError(res.error);
              }
            })
          }
          className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-orange-500 disabled:opacity-60"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Comenzar test
        </button>
      </div>
    );
  }

  const item = items[step];
  const isLast = step === items.length - 1;
  const answered = answers[item.id] !== undefined;

  const setAnswer = (value: unknown) => {
    const next = { ...answers, [item.id]: value };
    setAnswers(next);
    saveAttemptProgress(attempt.id, next); // fire-and-forget autosave
  };

  const handleNext = () => {
    if (isLast) {
      startTransition(async () => {
        const res = await submitAttempt(attempt.id, test.id, answers);
        if (res.success) {
              fetch("/api/reports/openai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reportId: res.reportId }),
  });
          router.push(`/reports/${res.reportId}`);
        }
      });
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_18px_60px_-42px_rgba(15,23,42,0.5)]">
      <div className="border-b border-slate-100 bg-[#fffaf5] px-5 pb-5 pt-6 sm:px-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500 text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            Tu espacio
          </div>
          <span className="text-[11px] font-medium text-slate-400">Sin prisa</span>
        </div>
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-orange-500 transition-all duration-300"
            style={{ width: `${((step + 1) / items.length) * 100}%` }}
          />
        </div>
        <p className="text-[13px] font-medium text-slate-600">{getEncouragement(step, items.length)}</p>
      </div>

      <div className="px-5 py-7 sm:px-8 sm:py-10">
        <div className="mb-7 flex items-start gap-3">
          <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
          </span>
          <h2 className="text-[20px] font-semibold leading-snug tracking-[-0.02em] text-slate-950 sm:text-[24px]">{item.question}</h2>
        </div>

        <QuestionInput item={item} value={answers[item.id]} onChange={setAnswer} />

        <div className="mt-9 flex items-center justify-between border-t border-slate-100 pt-5">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-slate-900 disabled:opacity-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={!answered || isPending}
          className="flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-orange-500 disabled:opacity-40"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isLast ? (
            "Finalizar"
          ) : (
            <>
              Siguiente <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
        </div>
      </div>
    </div>
  );
}

function QuestionInput({
  item,
  value,
  onChange,
}: {
  item: TestItem;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  // Single-answer choice: render whenever options exist (type may be missing)
  if (item.options && item.options.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        {item.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-[13.5px] transition-all",
              value === opt.id
                ? "border-orange-500 bg-orange-500 text-white shadow-[0_8px_20px_-12px_rgba(255,90,31,0.8)]"
                : "border-slate-200 text-slate-700 hover:border-orange-200 hover:bg-orange-50/60"
            )}
          >
            {opt.text}
            {value === opt.id && <Check className="h-4 w-4" />}
          </button>
        ))}
      </div>
    );
  }

  if (item.type === "scale") {
    const current = typeof value === "number" ? value : null;
    return (
      <div className="flex items-center justify-between gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl border text-[14px] font-semibold transition-all",
              current === n
                ? "border-orange-500 bg-orange-500 text-white"
                : "border-slate-200 text-slate-500 hover:border-orange-200 hover:bg-orange-50"
            )}
          >
            {n}
          </button>
        ))}
      </div>
    );
  }

  // text fallback — only when no options and not a scale question
  return (
    <textarea
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full resize-none rounded-xl border border-black/[0.08] px-4 py-3 text-[13.5px] text-black outline-none focus:border-black/25"
      placeholder="Escribe tu respuesta..."
    />
  );
}