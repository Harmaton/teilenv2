"use server";

import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";


export type DashboardStats = {
  testsCompleted: number;
  inProgress: number;
  reportsReady: number;
  creditsUsed: number;
};

export type TestAttemptRow = {
  id: string;
  testTitle: string;
  status: "not_started" | "in_progress" | "completed" | "abandoned";
  score: number | null;
  startedAt: string | null;
  completedAt: string | null;
  hasReport: boolean;
  reportStatus: "pending" | "generating" | "completed" | "failed" | null;
};

export async function getDashboardStats(): Promise<{ success: true; data: DashboardStats } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();
  const profileId = authResult.user.id;

  const [attemptsRes, reportsRes, creditsRes] = await Promise.all([
    supabase
      .from("test_attempts")
      .select("status", { count: "exact" })
      .eq("profile_id", profileId),
    supabase
      .from("reports")
      .select("id", { count: "exact" })
      .eq("profile_id", profileId)
      .eq("status", "completed"),
    supabase
      .from("ai_credits_usage")
      .select("credits_used")
      .eq("profile_id", profileId),
  ]);

  if (attemptsRes.error) return { success: false, error: attemptsRes.error.message };
  if (reportsRes.error) return { success: false, error: reportsRes.error.message };
  if (creditsRes.error) return { success: false, error: creditsRes.error.message };

  const testsCompleted = attemptsRes.data.filter((a) => a.status === "completed").length;
  const inProgress = attemptsRes.data.filter((a) => a.status === "in_progress").length;
  const creditsUsed = creditsRes.data.reduce((sum, r) => sum + Number(r.credits_used ?? 0), 0);

  return {
    success: true,
    data: {
      testsCompleted,
      inProgress,
      reportsReady: reportsRes.count ?? 0,
      creditsUsed,
    },
  };
}

export async function getUserTestAttempts(): Promise<{ success: true; data: TestAttemptRow[] } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("test_attempts")
    .select(
      `
      id,
      status,
      score,
      started_at,
      completed_at,
      tests ( title ),
      reports ( status )
    `
    )
    .eq("profile_id", authResult.user.id)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };

  const rows: TestAttemptRow[] = data.map((row: any) => ({
    id: row.id,
    testTitle: row.tests?.title ?? "Untitled test",
    status: row.status,
    score: row.score,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    hasReport: Array.isArray(row.reports) && row.reports.length > 0,
    reportStatus: row.reports?.[0]?.status ?? null,
  }));

  return { success: true, data: rows };
}