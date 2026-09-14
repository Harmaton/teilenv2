"use server";

import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calculateBenzingerScores, type BenzingerItem } from "@/lib/benzinger-scoring";
import { getTestProfileEligibility } from "@/lib/test-eligibility";
import { pushNotification } from "@/_actions/notifications";

export type TestItem = {
  id: string;
  question: string;
  type: "single_choice" | "multi_choice" | "scale" | "text";
  options?: { id: string; text: string }[];
  scoring?: BenzingerItem["scoring"];
};

export type TestDetail = {
  id: string;
  title: string;
  description: string | null;
  isFree: boolean;
  items: TestItem[];
};

export type AttemptState = {
  id: string;
  status: "not_started" | "in_progress" | "completed" | "abandoned";
  answers: Record<string, unknown>;
  itemsSnapshot: TestItem[];
};

export async function getTestWithAttempt(
  testId: string
): Promise<{ success: true; test: TestDetail; attempt: AttemptState | null } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();

  const eligibility = await getTestProfileEligibility(authResult.user.id);
  if (!eligibility.eligible) return { success: false, error: eligibility.error };

  const { data: test, error: testError } = await supabase
    .from("tests")
    .select("id, title, description, is_free, items, is_published")
    .eq("id", testId)
    .single();

  if (testError || !test) return { success: false, error: "Test not found." };
  if (!test.is_published) return { success: false, error: "This test isn't available." };

  const { data: existing, error: attemptError } = await supabase
    .from("test_attempts")
    .select("id, status, answers, items_snapshot")
    .eq("test_id", testId)
    .eq("profile_id", authResult.user.id)
    .in("status", ["not_started", "in_progress"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (attemptError) return { success: false, error: attemptError.message };

  return {
    success: true,
    test: {
      id: test.id,
      title: test.title,
      description: test.description,
      isFree: test.is_free,
      items: test.items as TestItem[],
    },
    attempt: existing
      ? {
          id: existing.id,
          status: existing.status,
          answers: (existing.answers as Record<string, unknown>) ?? {},
          itemsSnapshot: existing.items_snapshot as TestItem[],
        }
      : null,
  };
}

export async function startAttempt(
  testId: string
): Promise<{ success: true; attemptId: string } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();

  const eligibility = await getTestProfileEligibility(authResult.user.id);
  if (!eligibility.eligible) return { success: false, error: eligibility.error };

  const { data: test, error: testError } = await supabase
    .from("tests")
    .select("items")
    .eq("id", testId)
    .single();

  if (testError || !test) return { success: false, error: "Test not found." };

  const { data, error } = await supabase
    .from("test_attempts")
    .insert({
      test_id: testId,
      profile_id: authResult.user.id,
      items_snapshot: test.items,
      status: "in_progress",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath(`/tests/${testId}`);
  await pushNotification({
    profile_id: authResult.user.id,
    title: "Test iniciado",
    body: "Tómate tu tiempo y responde con honestidad.",
    type: "info",
    href: `/tests/${testId}`,
  });
  return { success: true, attemptId: data.id };
}

export async function saveAttemptProgress(
  attemptId: string,
  answers: Record<string, unknown>
): Promise<{ success: true } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();

  const { error } = await supabase
    .from("test_attempts")
    .update({ answers, updated_at: new Date().toISOString() })
    .eq("id", attemptId)
    .eq("profile_id", authResult.user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function submitAttempt(
  attemptId: string,
  testId: string,
  answers: Record<string, unknown>
): Promise<{ success: true; reportId: string } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();

  const { error: updateError } = await supabase
    .from("test_attempts")
    .update({
      answers,
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", attemptId)
    .eq("profile_id", authResult.user.id);

  if (updateError) return { success: false, error: updateError.message };

  const { data: attempt, error: attemptError } = await supabase
    .from("test_attempts")
    .select("items_snapshot")
    .eq("id", attemptId)
    .eq("profile_id", authResult.user.id)
    .single();
  if (attemptError || !attempt) return { success: false, error: attemptError?.message ?? "Attempt not found." };

  const scores = calculateBenzingerScores(
    (attempt.items_snapshot as BenzingerItem[]) ?? [],
    answers,
  );

  const { error: scoreError } = await supabase
    .from("test_attempts")
    .update({
      score: Math.round(
        (scores.percentages.RB + scores.percentages.LB + scores.percentages.RF + scores.percentages.LF) / 4,
      ),
      quadrant_scores: scores,
      updated_at: new Date().toISOString(),
    })
    .eq("id", attemptId)
    .eq("profile_id", authResult.user.id);
  if (scoreError) return { success: false, error: scoreError.message };

  // Queue the report — generation itself happens out-of-band (see note below).
  const { data: report, error: reportError } = await supabase
    .from("reports")
    .insert({
      test_id: testId,
      attempt_id: attemptId,
      profile_id: authResult.user.id,
      status: "pending",
    })
    .select("id")
    .single();

  if (reportError) return { success: false, error: reportError.message };

  revalidatePath("/dashboard");
  revalidatePath("/reports");
  await pushNotification({
    profile_id: authResult.user.id,
    title: "Test completado",
    body: "Estamos preparando tu informe de Identidad Evolutiva.",
    type: "success",
    href: `/reports/${report.id}`,
  });
  return { success: true, reportId: report.id };
}