// Suggested path: app/_actions/admin-dashboard.ts
"use server";

import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/* ────────────────────────────────────────────────────────────────────── */
/* Types                                                                  */
/* ────────────────────────────────────────────────────────────────────── */

export type AdminDashboardStats = {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  activeUsers7d: number;
  churnRate: number; // percentage, 0-100

  totalAttempts: number;
  attemptsToday: number;
  inProgressAttempts: number;
  completedAttempts: number;
  abandonedAttempts: number;
  completionRate: number; // percentage, 0-100

  totalReports: number;
  reportsCompleted: number;
  reportsPending: number;
  reportsFailed: number;
  reportGenerationRate: number; // percentage of completed attempts with a completed report

  totalCreditsUsed: number;
  creditsUsedToday: number;
};

export type DailyTrendPoint = {
  date: string; // YYYY-MM-DD
  attempts: number;
};

export type TopTestRow = {
  id: string;
  title: string;
  attempts: number;
  completionRate: number;
};

export type RecentAttemptRow = {
  id: string;
  testTitle: string;
  userName: string;
  userEmail: string;
  status: "not_started" | "in_progress" | "completed" | "abandoned";
  score: number | null;
  startedAt: string | null;
  completedAt: string | null;
  hasReport: boolean;
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
    return { success: false as const, error: "No tienes permisos para ver este panel." };
  }

  return { success: true as const, supabase };
}

function daysAgoISO(days: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

/* ────────────────────────────────────────────────────────────────────── */
/* Core stats                                                             */
/* ────────────────────────────────────────────────────────────────────── */

export async function getAdminDashboardStats(): Promise<ActionResult<AdminDashboardStats>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;
  const { supabase } = auth;

  const today = daysAgoISO(0);
  const weekAgo = daysAgoISO(7);
  const monthAgo = daysAgoISO(30);
  const twoMonthsAgo = daysAgoISO(60);

  const [
    usersRes,
    newTodayRes,
    newWeekRes,
    attemptsRes,
    attemptsTodayRes,
    activeWeekRes,
    activeRecentRes,
    activePriorRes,
    reportsRes,
    creditsRes,
    creditsTodayRes,
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", today),
    supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
    supabase.from("test_attempts").select("status"),
    supabase.from("test_attempts").select("id", { count: "exact", head: true }).gte("created_at", today),
    supabase.from("test_attempts").select("profile_id").gte("created_at", weekAgo),
    supabase.from("test_attempts").select("profile_id").gte("created_at", monthAgo),
    supabase.from("test_attempts").select("profile_id").gte("created_at", twoMonthsAgo).lt("created_at", monthAgo),
    supabase.from("reports").select("status"),
    supabase.from("ai_credits_usage").select("credits_used"),
    supabase.from("ai_credits_usage").select("credits_used").gte("created_at", today),
  ]);

  for (const r of [
    usersRes, newTodayRes, newWeekRes, attemptsRes, attemptsTodayRes,
    activeWeekRes, activeRecentRes, activePriorRes, reportsRes, creditsRes, creditsTodayRes,
  ]) {
    if (r.error) return { success: false, error: r.error.message };
  }

  const attemptsData = attemptsRes.data ?? [];
  const totalAttempts = attemptsData.length;
  const inProgressAttempts = attemptsData.filter((a) => a.status === "in_progress").length;
  const completedAttempts = attemptsData.filter((a) => a.status === "completed").length;
  const abandonedAttempts = attemptsData.filter((a) => a.status === "abandoned").length;
  const completionRate = totalAttempts > 0 ? (completedAttempts / totalAttempts) * 100 : 0;

  const activeUsers7d = new Set((activeWeekRes.data ?? []).map((r) => r.profile_id)).size;

  // Churn: users active in the 30-60 day window who did NOT come back in the last 30 days.
  const activeRecentIds = new Set((activeRecentRes.data ?? []).map((r) => r.profile_id));
  const activePriorIds = new Set((activePriorRes.data ?? []).map((r) => r.profile_id));
  let churned = 0;
  activePriorIds.forEach((id) => {
    if (!activeRecentIds.has(id)) churned += 1;
  });
  const churnRate = activePriorIds.size > 0 ? (churned / activePriorIds.size) * 100 : 0;

  const reportsData = reportsRes.data ?? [];
  const totalReports = reportsData.length;
  const reportsCompleted = reportsData.filter((r) => r.status === "completed").length;
  const reportsPending = reportsData.filter((r) => r.status === "pending" || r.status === "generating").length;
  const reportsFailed = reportsData.filter((r) => r.status === "failed").length;
  const reportGenerationRate = completedAttempts > 0 ? (reportsCompleted / completedAttempts) * 100 : 0;

  const totalCreditsUsed = (creditsRes.data ?? []).reduce((s, r) => s + Number(r.credits_used ?? 0), 0);
  const creditsUsedToday = (creditsTodayRes.data ?? []).reduce((s, r) => s + Number(r.credits_used ?? 0), 0);

  return {
    success: true,
    data: {
      totalUsers: usersRes.count ?? 0,
      newUsersToday: newTodayRes.count ?? 0,
      newUsersThisWeek: newWeekRes.count ?? 0,
      activeUsers7d,
      churnRate,
      totalAttempts,
      attemptsToday: attemptsTodayRes.count ?? 0,
      inProgressAttempts,
      completedAttempts,
      abandonedAttempts,
      completionRate,
      totalReports,
      reportsCompleted,
      reportsPending,
      reportsFailed,
      reportGenerationRate,
      totalCreditsUsed,
      creditsUsedToday,
    },
  };
}

/* ────────────────────────────────────────────────────────────────────── */
/* Trend — attempts per day                                               */
/* ────────────────────────────────────────────────────────────────────── */

export async function getDailyAttemptsTrend(days = 14): Promise<ActionResult<DailyTrendPoint[]>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;
  const { supabase } = auth;

  const since = daysAgoISO(days - 1);
  const { data, error } = await supabase
    .from("test_attempts")
    .select("created_at")
    .gte("created_at", since);

  if (error) return { success: false, error: error.message };

  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }

  for (const row of data ?? []) {
    const key = String(row.created_at).slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return {
    success: true,
    data: Array.from(buckets.entries()).map(([date, attempts]) => ({ date, attempts })),
  };
}

/* ────────────────────────────────────────────────────────────────────── */
/* Top tests by volume                                                    */
/* ────────────────────────────────────────────────────────────────────── */

export async function getTopTests(limit = 5): Promise<ActionResult<TopTestRow[]>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;
  const { supabase } = auth;

  const [testsRes, attemptsRes] = await Promise.all([
    supabase.from("tests").select("id, title"),
    supabase.from("test_attempts").select("test_id, status"),
  ]);

  if (testsRes.error) return { success: false, error: testsRes.error.message };
  if (attemptsRes.error) return { success: false, error: attemptsRes.error.message };

  const counts = new Map<string, { attempts: number; completed: number }>();
  for (const a of attemptsRes.data ?? []) {
    const entry = counts.get(a.test_id) ?? { attempts: 0, completed: 0 };
    entry.attempts += 1;
    if (a.status === "completed") entry.completed += 1;
    counts.set(a.test_id, entry);
  }

  const rows: TopTestRow[] = (testsRes.data ?? [])
    .map((t) => {
      const c = counts.get(t.id) ?? { attempts: 0, completed: 0 };
      return {
        id: t.id,
        title: t.title,
        attempts: c.attempts,
        completionRate: c.attempts > 0 ? (c.completed / c.attempts) * 100 : 0,
      };
    })
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, limit);

  return { success: true, data: rows };
}

/* ────────────────────────────────────────────────────────────────────── */
/* Recent attempts — across all users (admin view)                        */
/* ────────────────────────────────────────────────────────────────────── */

export async function getRecentAttemptsAdmin(limit = 10): Promise<ActionResult<RecentAttemptRow[]>> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;
  const { supabase } = auth;

  const { data, error } = await supabase
    .from("test_attempts")
    .select(
      `id, status, score, started_at, completed_at,
       tests ( title ),
       profiles ( full_name, email ),
       reports ( id )`
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return { success: false, error: error.message };

  const rows: RecentAttemptRow[] = (data ?? []).map((a: any) => ({
    id: a.id,
    testTitle: a.tests?.title ?? "—",
    userName: a.profiles?.full_name ?? "—",
    userEmail: a.profiles?.email ?? "—",
    status: a.status,
    score: a.score,
    startedAt: a.started_at,
    completedAt: a.completed_at,
    hasReport: Array.isArray(a.reports) && a.reports.length > 0,
  }));

  return { success: true, data: rows };
}