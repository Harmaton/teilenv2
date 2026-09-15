"use server";

import { createClient } from "@supabase/supabase-js";

// ⚠️ This uses the SERVICE ROLE key — bypasses RLS.
// Never import this file into a Client Component.
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing Supabase service role env vars");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Shape of the Hotmart payload we care about
type HotmartPurchaseData = {
  product?: { id?: number | string; name?: string };
  offer?: { code?: string };
  buyer?: {
    email?: string;
    name?: string;
    document?: string;
  };
  purchase?: {
    transaction?: string;
    status?: string;
    price?: { value?: number; currency_value?: string };
    payment?: { type?: string };
    offer?: { code?: string };
  };
};

export type UpdatePaymentResult =
  | { success: true; alreadyProcessed: boolean; unlockedCount: number; profileId: string | null }
  | { success: false; error: string };

export async function updatePayment(
  data: HotmartPurchaseData
): Promise<UpdatePaymentResult> {
  try {
    const supabase = getAdminClient();

    const transactionId = data?.purchase?.transaction;
    const buyerEmail = data?.buyer?.email?.toLowerCase().trim() ?? null;

    if (!transactionId) {
      return { success: false, error: "Missing transaction ID" };
    }
    if (!buyerEmail) {
      return { success: false, error: "Missing buyer email" };
    }

    // ---------- 1. Idempotency check ----------
    const { data: existing } = await supabase
      .from("purchases")
      .select("id, profile_id")
      .eq("transaction_id", transactionId)
      .maybeSingle();

    if (existing) {
      console.log(`[updatePayment] Transaction ${transactionId} already processed`);
      return {
        success: true,
        alreadyProcessed: true,
        unlockedCount: 0,
        profileId: existing.profile_id,
      };
    }

    // ---------- 2. Match buyer to a profile ----------
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("email", buyerEmail)
      .maybeSingle();

    const profileId = profile?.id ?? null;

    // ---------- 3. Log the purchase ----------
    const { error: insertErr } = await supabase.from("purchases").insert({
      transaction_id: transactionId,
      buyer_email: buyerEmail,
      buyer_name: data?.buyer?.name ?? null,
      buyer_doc: data?.buyer?.document ?? null,
      product_id: data?.product?.id ? String(data.product.id) : null,
      product_name: data?.product?.name ?? null,
      offer_code: data?.purchase?.offer?.code ?? data?.offer?.code ?? null,
      price_value: data?.purchase?.price?.value ?? null,
      price_currency: data?.purchase?.price?.currency_value ?? null,
      payment_type: data?.purchase?.payment?.type ?? null,
      status: data?.purchase?.status ?? "UNKNOWN",
      raw_payload: data as any,
      profile_id: profileId,
    });

    if (insertErr) {
      // If it's a unique-violation race, treat as already processed
      if (insertErr.code === "23505") {
        return {
          success: true,
          alreadyProcessed: true,
          unlockedCount: 0,
          profileId,
        };
      }
      console.error("[updatePayment] insert purchase failed:", insertErr);
      return { success: false, error: insertErr.message };
    }

    // ---------- 4. Unlock the user's locked reports ----------
    if (!profileId) {
      console.warn(
        `[updatePayment] No profile matched for ${buyerEmail}. Purchase logged for manual review.`
      );
      return { success: true, alreadyProcessed: false, unlockedCount: 0, profileId: null };
    }

    // Only flip locked → paid. Never overwrite free_code or admin_granted.
    const { data: updated, error: updateErr } = await supabase
      .from("reports")
      .update({ access_type: "paid" })
      .eq("profile_id", profileId)
      .eq("access_type", "locked")
      .select("id");

    if (updateErr) {
      console.error("[updatePayment] unlock reports failed:", updateErr);
      return { success: false, error: updateErr.message };
    }

    const unlockedCount = updated?.length ?? 0;
    console.log(
      `[updatePayment] Transaction ${transactionId} processed. Unlocked ${unlockedCount} report(s).`
    );

    return {
      success: true,
      alreadyProcessed: false,
      unlockedCount,
      profileId,
    };
  } catch (err) {
    console.error("[updatePayment] unexpected error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}