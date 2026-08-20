// Suggested path: app/_actions/admin-reports.ts
"use server";

import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ReportScore } from "./reports";

/* ────────────────────────────────────────────────────────────────────── */
/* Types                                                                  */
/* ────────────────────────────────────────────────────────────────────── */

export type ReportSummary = {
  id: string;
  testTitle: string;
  status: "pending" | "generating" | "completed" | "failed";
  aiModel: string | null;
  createdAt: string;
  score: number | null;
};

export type UserReportGroup = {
  profileId: string;
  fullName: string | null;
  email: string | null;
  reports: ReportSummary[];
};

// Mirrors the shape ReportView expects from "@/_actions/reports" —
// keep this in sync with that type if it changes.
export type ReportDetail = {
  id: string;
  status: "pending" | "generating" | "completed" | "failed";
  error: string | null;
  content: { html?: string; scores?: ReportScore } ;
  testTitle: string;
  testDescription: string | null;
  updatedAt: string;
  attemptCompletedAt: string | null;
  user: {
    fullName: string | null;
    email: string | null;
  };
};

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

/* ────────────────────────────────────────────────────────────────────── */
/* Helpers                                                                */
/* ────────────────────────────────────────────────────────────────────── */

async function requireAdmin() {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false as const, error: authResult.error };

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authResult.user.id)
    .single();

  if (error) return { success: false as const, error: error.message };
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return { success: false as const, error: "No tienes permisos para ver esta sección." };
  }

  return { success: true as const, supabase };
}

/* ────────────────────────────────────────────────────────────────────── */
/* Reports grouped by user                                                */
/* ────────────────────────────────────────────────────────────────────── */

export async function getReportsGroupedByUser(): Promise<ActionResult<UserReportGroup[]>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;
  const { supabase } = auth;

  const { data, error } = await supabase
    .from("reports")
    .select(
      `id, status, ai_model, created_at,
       profiles ( id, full_name, email ),
       tests ( title ),
       test_attempts ( score )`
    )
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };

  const groups = new Map<string, UserReportGroup>();

  for (const r of data ?? []) {
    const profile = r.profiles as any;
    const key = profile?.id ?? "unknown";

    if (!groups.has(key)) {
      groups.set(key, {
        profileId: key,
        fullName: profile?.full_name ?? null,
        email: profile?.email ?? null,
        reports: [],
      });
    }

    groups.get(key)!.reports.push({
      id: r.id,
      testTitle: (r.tests as any)?.title ?? "—",
      status: r.status,
      aiModel: r.ai_model,
      createdAt: r.created_at,
      score: (r.test_attempts as any)?.score ?? null,
    });
  }

  // Users with the most report activity first.
  return {
    success: true,
    data: Array.from(groups.values()).sort((a, b) => b.reports.length - a.reports.length),
  };
}

/* ────────────────────────────────────────────────────────────────────── */
/* Single report by id — admin view, no ownership restriction            */
/* ────────────────────────────────────────────────────────────────────── */

export async function getReportDetailAdmin(id: string): Promise<ActionResult<ReportDetail>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;
  const { supabase } = auth;

  if (!id) return { success: false, error: "Falta el id del informe." };

  const { data, error } = await supabase
    .from("reports")
    .select(
      `id, status, error, content, updated_at,
       tests ( title, description ),
       profiles ( full_name, email ),
       test_attempts ( completed_at )`
    )
    .eq("id", id)
    .single();

  if (error) return { success: false, error: error.message };

  const test = data.tests as any;
  const profile = data.profiles as any;
  const attempt = data.test_attempts as any;

  return {
    success: true,
    data: {
      id: data.id,
      status: data.status,
      error: data.error,
      content: data.content,
      testTitle: test?.title ?? "—",
      testDescription: test?.description ?? null,
      updatedAt: data.updated_at,
      attemptCompletedAt: attempt?.completed_at ?? null,
      user: {
        fullName: profile?.full_name ?? null,
        email: profile?.email ?? null,
      },
    },
  };
}

export async function retryReportGenerationAdmin(id: string): Promise<ActionResult<null>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;
  const { supabase } = auth;

  const { error } = await supabase
    .from("reports")
    .update({ status: "pending", error: null })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true, data: null };
}