"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type ReportStatus = "pending" | "generating" | "completed" | "failed";

export type ReportSummary = {
  id: string;
  testTitle: string;
  status: ReportStatus;
  createdAt: string;
};

export type ChartSpec =
  | { type: "bar"; title: string; data: { label: string; value: number }[] }
  | { type: "radar"; title: string; data: { label: string; value: number }[] };

export type ReportContent = {
  html: string;
  charts: ChartSpec[];
};

export type ReportDetail = {
  id: string;
  testTitle: string;
  testDescription: string | null;
  status: ReportStatus;
  error: string | null;
  content: ReportContent | null;
  createdAt: string;
  updatedAt: string;
  user: { fullName: string | null; email: string | null; avatarUrl: string | null };
  attemptCompletedAt: string | null;
};

export async function getUserReports(): Promise<{ success: true; data: ReportSummary[] } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select("id, status, created_at, tests ( title )")
    .eq("profile_id", authResult.user.id)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };

  return {
    success: true,
    data: data.map((r: any) => ({
      id: r.id,
      testTitle: r.tests?.title ?? "Untitled test",
      status: r.status,
      createdAt: r.created_at,
    })),
  };
}

export async function getReportDetail(
  reportId: string
): Promise<{ success: true; data: ReportDetail } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select(
      `id, status, error, content, created_at, updated_at,
       tests ( title, description ),
       profiles ( full_name, avatar_url, email ),
       test_attempts ( created_at )`
    )
    .eq("id", reportId)
    .eq("profile_id", authResult.user.id)
    .single();

  if (error || !data) return { success: false, error: "Report not found." };

  return {
    success: true,
    data: {
      id: data.id,
      testTitle: (data as any).tests?.title ?? "Untitled test",
      testDescription: (data as any).tests?.description ?? null,
      status: data.status,
      error: data.error,
      content: data.status === "completed" ? (data.content as ReportContent) : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      user: {
        fullName: (data as any).profiles?.full_name ?? null,
        email: (data as any).profiles?.email ?? null,
        avatarUrl: (data as any).profiles?.avatar_url ?? null,
      },
      attemptCompletedAt: (data as any).test_attempts?.created_at ?? null,
    },
  };
}

export async function retryReportGeneration(
  reportId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("reports")
    .update({ status: "pending", error: null })
    .eq("id", reportId)
    .eq("profile_id", authResult.user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/reports/${reportId}`);
  return { success: true };
}
