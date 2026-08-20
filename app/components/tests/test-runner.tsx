"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  startAttempt,
  saveAttemptProgress,
  submitAttempt,
  type TestDetail,
  type AttemptState,
  type TestItem,
} from "@/_actions/test-attempts";

const ACCENT = "#FF5A1F";

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

  const items: TestItem[] = attempt?.itemsSnapshot ?? test.items;

  // ── Not started yet ─────────────────────────────────────
  if (!attempt) {
    return (
      <div className="rounded-2xl border border-black/[0.06] bg-white p-8 text-center">
        <h1 className="text-[19px] font-semibold text-black">{test.title}</h1>
        {test.description && (
          <p className="mx-auto mt-2 max-w-md text-[13.5px] text-black/50">
            {test.description}
          </p>
        )}
        <p className="mt-4 text-[12px] text-black/35">
          {test.items.length} {test.items.length === 1 ? "pregunta" : "preguntas"}
        </p>
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
              
              }
            })
          }
          className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: ACCENT }}
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
              fetch("/api/reports/generate", {
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
    <div className="rounded-2xl border border-black/[0.06] bg-white p-8">
      {/* progress */}
      <div className="mb-6 flex items-center gap-1.5">
        {items.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{ backgroundColor: i <= step ? ACCENT : "rgba(0,0,0,0.08)" }}
          />
        ))}
      </div>
      <p className="mb-1 text-[11.5px] font-medium uppercase tracking-wide text-black/35">
        Pregunta {step + 1} de {items.length}
      </p>
      <h2 className="mb-6 text-[16px] font-semibold text-black">{item.question}</h2>

      <QuestionInput item={item} value={answers[item.id]} onChange={setAnswer} />

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-1.5 text-[13px] font-medium text-black/40 hover:text-black disabled:opacity-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={!answered || isPending}
          className="flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: ACCENT }}
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
              "rounded-xl border px-4 py-3 text-left text-[13.5px] transition-colors",
              value === opt.id
                ? "border-transparent text-white"
                : "border-black/[0.08] text-black/70 hover:border-black/20"
            )}
            style={value === opt.id ? { backgroundColor: ACCENT } : undefined}
          >
            {opt.text}
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
              "flex h-11 w-11 items-center justify-center rounded-full border text-[14px] font-semibold transition-colors",
              current === n
                ? "border-transparent text-white"
                : "border-black/[0.08] text-black/50 hover:border-black/20"
            )}
            style={current === n ? { backgroundColor: ACCENT } : undefined}
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