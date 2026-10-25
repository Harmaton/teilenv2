"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Compass, X } from "lucide-react";

const STORAGE_KEY = "teilen-dashboard-tour";
const CHANGE_EVENT = "teilen-dashboard-tour-change";

const STEPS = [
  {
    target: "dashboard-quick-actions",
    eyebrow: "Paso 1 de 5",
    title: "Empieza por tu perfil",
    description: "Actualiza tus datos personales desde aquí. Así tendrás tu espacio listo antes de comenzar.",
    action: "Actualizar perfil",
    href: "/settings",
  },
  {
    target: "dashboard-values",
    eyebrow: "Paso 2 de 5",
    title: "Completa tus valores y fortalezas",
    description: "Necesitarás seleccionar tus valores y fortalezas para preparar tu perfil antes de iniciar una evaluación.",
    action: "Ir a valores y fortalezas",
    href: "#dashboard-values",
  },
  {
    target: "dashboard-minors",
    eyebrow: "Paso 3 de 5 · Opcional",
    title: "¿Acompañas a un menor?",
    description: "Añade aquí sus datos y tu vínculo. Después podrás elegir para quién realizar cada evaluación.",
    action: "Gestionar perfiles de menores",
    href: "#dashboard-minors",
  },
  {
    target: "dashboard-quick-actions",
    eyebrow: "Paso 4 de 5",
    title: "Realiza una evaluación",
    description: "Explora las pruebas disponibles y elige si la harás tú o uno de los menores a tu cargo.",
    action: "Explorar pruebas",
    href: "/tests",
  },
  {
    target: "dashboard-quick-actions",
    eyebrow: "Paso 5 de 5",
    title: "Consulta tus informes",
    description: "Cuando una evaluación termine, encontrarás aquí los informes generados y podrás volver a ellos cuando quieras.",
    action: "Ver mis informes",
    href: "/reports",
  },
] as const;

type TourStatus = "active" | "dismissed" | "completed";

function subscribeToTour(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getTourSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "dismissed"
      && localStorage.getItem(STORAGE_KEY) !== "completed";
  } catch {
    return false;
  }
}

function setTourStatus(status: TourStatus) {
  try {
    localStorage.setItem(STORAGE_KEY, status);
  } catch {
    // Keep the tour usable when browser storage is unavailable.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function DashboardProductTour() {
  const isOpen = useSyncExternalStore(subscribeToTour, getTourSnapshot, () => false);
  const [stepIndex, setStepIndex] = useState(0);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const activeStep = STEPS[stepIndex];

  useEffect(() => {
    if (!isOpen) return;

    const target = document.getElementById(activeStep.target);
    if (!target) return;

    const previousPosition = target.style.position;
    const previousZIndex = target.style.zIndex;
    const previousBoxShadow = target.style.boxShadow;
    const previousBorderRadius = target.style.borderRadius;

    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.style.position = "relative";
    target.style.zIndex = "60";
    target.style.borderRadius = "24px";
    target.style.boxShadow = "0 0 0 5px rgba(242, 122, 26, .95), 0 0 0 100vmax rgba(20, 27, 60, .42)";
    nextButtonRef.current?.focus();

    return () => {
      target.style.position = previousPosition;
      target.style.zIndex = previousZIndex;
      target.style.boxShadow = previousBoxShadow;
      target.style.borderRadius = previousBorderRadius;
    };
  }, [activeStep.target, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTourStatus("dismissed");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const finish = () => setTourStatus("completed");
  const skip = () => setTourStatus("dismissed");
  const start = () => {
    setStepIndex(0);
    setTourStatus("active");
  };

  return (
    <>
      <button
        type="button"
        onClick={start}
        className="inline-flex items-center gap-2 rounded-full border border-[#141b3c]/10 bg-white px-4 py-2 text-[12px] font-semibold text-[#141b3c] shadow-sm transition hover:border-[#f27a1a]/40 hover:bg-[#fff8f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f27a1a]/40"
      >
        <Compass className="h-4 w-4 text-[#e46a12]" />
        Ver guía
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Saltar guía"
            onClick={skip}
            className="fixed inset-0 z-[50] cursor-default bg-[#141b3c]/35"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-tour-title"
            aria-describedby="dashboard-tour-description"
            className="fixed bottom-3 left-3 right-3 z-[80] mx-auto w-auto max-w-lg rounded-[26px] border border-[#141b3c]/10 bg-white p-5 shadow-[0_24px_80px_-30px_rgba(20,27,60,.55)] sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2 sm:w-full sm:-translate-x-1/2 sm:-translate-y-1/2 sm:p-7"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff3cf] text-[#e46a12]">
                  <Compass className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#e46a12]">
                    {activeStep.eyebrow}
                  </p>
                  <h2 id="dashboard-tour-title" className="mt-1 text-lg font-bold text-[#141b3c]">
                    {activeStep.title}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={skip}
                aria-label="Cerrar guía"
                className="rounded-full p-2 text-[#545c7e] transition hover:bg-[#f6f5fb] hover:text-[#141b3c]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p id="dashboard-tour-description" className="text-sm leading-6 text-[#545c7e]">
              {activeStep.description}
            </p>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={skip}
                className="rounded-full px-3 py-2 text-[12px] font-medium text-[#545c7e] transition hover:bg-[#f6f5fb] hover:text-[#141b3c]"
              >
                Saltar recorrido
              </button>
              <div className="flex items-center gap-2">
                {stepIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setStepIndex((current) => current - 1)}
                    className="inline-flex items-center gap-1 rounded-full border border-[#141b3c]/10 px-3 py-2 text-[12px] font-semibold text-[#141b3c] transition hover:bg-[#f6f5fb]"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Atrás
                  </button>
                )}
                {stepIndex < STEPS.length - 1 ? (
                  <button
                    ref={nextButtonRef}
                    type="button"
                    onClick={() => setStepIndex((current) => current + 1)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#f27a1a] px-4 py-2 text-[12px] font-bold text-[#141b3c] shadow-[3px_3px_0_#141b3c] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141b3c]/30"
                  >
                    Siguiente
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    ref={nextButtonRef}
                    type="button"
                    onClick={finish}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#f27a1a] px-4 py-2 text-[12px] font-bold text-[#141b3c] shadow-[3px_3px_0_#141b3c] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141b3c]/30"
                  >
                    Terminar
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#141b3c]/[0.06] pt-4">
              <div className="flex items-center gap-1.5" aria-label={`Paso ${stepIndex + 1} de ${STEPS.length}`}>
                {STEPS.map((step, index) => (
                  <span
                    key={step.title}
                    className={`h-1.5 rounded-full transition-all ${
                      index === stepIndex ? "w-6 bg-[#f27a1a]" : "w-1.5 bg-[#141b3c]/15"
                    }`}
                  />
                ))}
              </div>
              <Link
                href={activeStep.href}
                onClick={skip}
                className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#C94A1B] transition hover:underline"
              >
                {activeStep.action}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>
        </>
      )}
    </>
  );
}
