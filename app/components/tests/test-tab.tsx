"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, ListChecks, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { TestCard } from "@/_actions/tests";
import { ProfileValues } from "./Profile-Values";
import { ProfileStrengths } from "./Profile-Strengths";


const ACCENT = "#FF5A1F";

type Tab = "values" | "strengths" | "tests";

export function TestsTabs({
  free,
  initialValues,
  initialStrengths,
}: {
  free: TestCard[];
  initialValues?: string[];
  initialStrengths?: string[];
}) {
  const [tab, setTab] = useState<Tab>("values");
  const router = useRouter();

  return (
    <div>
      {/* ── Tabs ──────────────────────────────────────────── */}
      <div className="mb-6 inline-flex items-center gap-1 rounded-full border border-black/[0.06] bg-black/[0.02] p-1">
        <TabButton active={tab === "values"} onClick={() => setTab("values")}>
          Estudio 1
        </TabButton>
        <TabButton active={tab === "strengths"} onClick={() => setTab("strengths")}>
          Estudio 2
        </TabButton>
        <TabButton active={tab === "tests"} onClick={() => setTab("tests")}>
          Estudio 3
          <Count>{free.length}</Count>
        </TabButton>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      {tab === "values" ? (
        <div className="rounded-3xl border border-black/[0.08] bg-white p-6">
          <ProfileValues initialValues={initialValues} />
        </div>
      ) : tab === "strengths" ? (
        <div className="rounded-3xl border border-black/[0.08] bg-white p-6">
          <ProfileStrengths initialStrengths={initialStrengths} />
        </div>
      ) : free.length === 0 ? (
        <div className="rounded-2xl border border-black/[0.06] bg-black/[0.02] px-6 py-10 text-center">
          <p className="text-[13px] text-black/45">No hay tests disponibles todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {free.map((test, i) => (
            <motion.button
              key={test.id}
              onClick={() => router.push(`/tests/${test.id}`)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex flex-col items-start overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-[border-color,box-shadow] duration-300 hover:border-orange-200 hover:shadow-[0_12px_28px_-12px_rgba(255,90,31,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40"
            >
              {/* subtle directional glow on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-orange-500/0 blur-2xl transition-colors duration-300 group-hover:bg-orange-500/10"
              />

              <div className="mb-4 flex w-full items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-black/[0.02] ring-1 ring-black/[0.04] transition-transform duration-300 group-hover:scale-105 group-hover:ring-orange-200">
                  <ListChecks className="h-4 w-4 text-orange-500/80" />
                </div>
                <ArrowUpRight className="h-4 w-4 -translate-x-0.5 translate-y-0.5 text-black/20 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-orange-500" />
              </div>

              <h3 className="text-[14px] font-semibold leading-snug text-black">
                {test.title}
              </h3>

              {test.description ? (
                <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-black/45">
                  {test.description}
                </p>
              ) : (
                <div className="mt-1.5 h-[2.6em]" aria-hidden />
              )}

              <div className="mt-4 flex w-full items-center justify-between border-t border-black/[0.05] pt-3">
                <div className="flex items-center gap-1.5 text-[11px] text-black/35">
                  <Sparkles className="h-3.5 w-3.5 text-orange-500/70" />
                  <span>Un momento para conocerte mejor</span>
                </div>
                <span className="translate-x-1 text-[11px] font-medium text-orange-600 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  Empezar →
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
        active ? "text-white" : "text-black/50 hover:text-black"
      )}
      style={active ? { backgroundColor: ACCENT } : undefined}
    >
      {children}
    </button>
  );
}

function Count({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-0.5 rounded-full bg-black/[0.06] px-1.5 py-0.5 text-[10.5px] leading-none text-black/50">
      {children}
    </span>
  );
}