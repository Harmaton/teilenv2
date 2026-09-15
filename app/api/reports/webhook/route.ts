import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { updatePayment } from "@/_actions/payments";


const HM_TOKEN = process.env.HOTTOK;

// Hotmart event types we care about
const HANDLED_EVENTS = new Set([
  "PURCHASE_COMPLETE",
  "PURCHASE_APPROVED",
  "PURCHASE_CANCELED",
  "PURCHASE_REFUNDED",
  "PURCHASE_CHARGEBACK",
  "PURCHASE_DELAYED",
  "PURCHASE_BILLET_PRINTED",
  "PURCHASE_EXPIRED",
  "CART_ABANDONMENT",
]);

export const POST = async (req: Request) => {
  try {
    // ---------- 1. Validate Hotmart token ----------
    const hmReceivedToken = (await headers()).get("x-hotmart-hottok") ?? "";

    if (!HM_TOKEN || HM_TOKEN !== hmReceivedToken) {
      console.warn("[hotmart] Invalid or missing Hotmart token");
      return NextResponse.json({ error: "Invalid Hotmart token" }, { status: 403 });
    }

    // ---------- 2. Parse payload ----------
    const rawBody = await req.json();
    console.log("[hotmart] Incoming:", {
      id: rawBody?.id,
      event: rawBody?.event,
      transaction: rawBody?.data?.purchase?.transaction,
      buyer: rawBody?.data?.buyer?.email,
    });

    const { id, event, data } = rawBody;

    // ---------- 3. Route by event ----------
    switch (event) {
      case "PURCHASE_COMPLETE":
      case "PURCHASE_APPROVED": {
        const result = await updatePayment(data);
        if (!result.success) {
          console.error("[hotmart] updatePayment failed:", result.error);
          return NextResponse.json(
            { error: "Failed to process payment" },
            { status: 500 }
          );
        }
        console.log(
          `[hotmart] Processed ${event}: alreadyProcessed=${result.alreadyProcessed}, unlocked=${result.unlockedCount}, profile=${result.profileId}`
        );
        break;
      }

      case "PURCHASE_CANCELED":
        console.log("[hotmart] Purchase canceled:", id);
        // Optionally: lock the report back, revoke access, etc.
        // Leave as-is unless you have a business reason to revoke.
        break;

      case "PURCHASE_REFUNDED":
      case "PURCHASE_CHARGEBACK":
        console.log(`[hotmart] ${event}:`, id);
        // Optionally: revoke access
        // await revokeAccess(data?.purchase?.transaction);
        break;

      case "PURCHASE_DELAYED":
      case "PURCHASE_BILLET_PRINTED":
      case "PURCHASE_EXPIRED":
        console.log(`[hotmart] Non-final event ${event}:`, id);
        break;

      case "CART_ABANDONMENT":
        console.log("[hotmart] Cart abandoned:", id);
        break;

      default:
        console.log(`[hotmart] Unhandled event type: ${event}`);
    }

    // ---------- 4. Always respond 200 to stop Hotmart retries ----------
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[hotmart] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};