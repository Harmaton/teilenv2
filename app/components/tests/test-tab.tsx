"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ListChecks, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { TestCard } from "@/_actions/tests";
import { ProfileValuesStrengths } from "./profile-values-strengths";


const ACCENT = "#FF5A1F";

type Tab = "free" | "paid" | "profile";

export function TestsTabs({
  free,
  paid,
  initialValues,
  initialStrengths,
}: {
  free: TestCard[];
  paid: TestCard[];
  initialValues?: string[];
  initialStrengths?: string[];
}) {
  const [tab, setTab] = useState<Tab>("free");
  const router = useRouter();

  const list = tab === "free" ? free : tab === "paid" ? paid : [];

  return (
    <div>
      {/* ── Tabs ──────────────────────────────────────────── */}
      <div className="mb-6 inline-flex items-center gap-1 rounded-full border border-black/[0.06] bg-black/[0.02] p-1">
        <TabButton active={tab === "free"} onClick={() => setTab("free") }>
          Gratis
          <Count>{free.length}</Count>
        </TabButton>
        <TabButton active={tab === "paid"} onClick={() => setTab("paid") }>
          Pago
          <Count>{paid.length}</Count>
        </TabButton>
        <TabButton active={tab === "profile"} onClick={() => setTab("profile") }>
          Perfil
        </TabButton>
      </div>

      {/* ── Grid/Content ──────────────────────────────────────────── */}
      {tab === "profile" ? (
        <div className="rounded-3xl border border-black/[0.08] bg-white p-6">
          <ProfileValuesStrengths
            initialValues={initialValues}
            initialStrengths={initialStrengths}
          />
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-black/[0.06] bg-black/[0.02] px-6 py-10 text-center">
          <p className="text-[13px] text-black/45">
            {tab === "free" ? "No hay tests gratuitos disponibles todavía." : "No hay tests pagos disponibles todavía."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((test) => (
            <button
              key={test.id}
              onClick={() => router.push(`/tests/${test.id}`)}
              className="group flex flex-col items-start rounded-2xl border border-black/[0.06] bg-white p-5 text-left transition-colors hover:border-black/[0.14]"
            >
              <div className="mb-3 flex w-full items-center justify-between">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: test.isFree ? "rgba(0,0,0,0.04)" : "rgba(255,90,31,0.1)",
                  }}
                >
                  {test.isFree ? (
                    <ListChecks className="h-4 w-4 text-black/50" />
                  ) : (
                    <Lock className="h-4 w-4" style={{ color: ACCENT }} />
                  )}
                </div>
                <ArrowUpRight className="h-4 w-4 text-black/20 transition-colors group-hover:text-black/50" />
              </div>

              <h3 className="text-[14px] font-semibold text-black">{test.title}</h3>

              {test.description && (
                <p className="mt-1 line-clamp-2 text-[12.5px] text-black/45">
                  {test.description}
                </p>
              )}

              <div className="mt-3 flex items-center gap-2 text-[11.5px] text-black/35">
                <span>{test.itemCount} {test.itemCount === 1 ? "pregunta" : "preguntas"}</span>
                {!test.isFree && (
                  <>
                    <span>·</span>
                    <span style={{ color: ACCENT }} className="font-medium">
                      Premium
                    </span>
                  </>
                )}
              </div>
            </button>
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