"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";
import type { ReportStatus } from "@/_actions/reports";

/**
 * Minimal status endpoint used by the waiting screen.
 *
 * `getReportDetail` is a heavy action (auth lookup + joined selects across
 * reports/tests/profiles/attempts + a profile_details read). Polling it every
 * few seconds just to learn whether the status flipped burned a lot of
 * round-trips for a single field.
 */
export async function getReportStatus(
  reportId: string
): Promise<{ success: true; status: ReportStatus } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reports")
    .select("status")
    .eq("id", reportId)
    .eq("profile_id", authResult.user.id)
    .maybeSingle();

  if (error) return { success: false, error: error.message };
  if (!data) return { success: false, error: "Report not found." };

  return { success: true, status: data.status as ReportStatus };
}
