"use server";

import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const FREE_REPLY_CAP = 3;

export type SalomonMessage = { role: "user" | "assistant"; content: string };

export async function getSalomonConversation(reportId: string): Promise<
  | {
      success: true;
      data: {
        messages: SalomonMessage[];
        freeRepliesUsed: number;
        isUnlocked: boolean;
        limitReached: boolean;
      };
    }
  | { success: false; error: string }
> {
  const authResult = await getAuthUser();
  if (!authResult.success) return { success: false, error: authResult.error ?? "No se pudo autenticar." };

  const supabase = await createClient();

  const { data: conversation, error: convError } = await supabase
    .from("salomon_conversations")
    .select("id, free_replies_used, is_unlocked")
    .eq("report_id", reportId)
    .eq("profile_id", authResult.user.id)
    .maybeSingle();

  if (convError) return { success: false, error: convError.message };

  // No conversation yet for this report — nothing to hydrate.
  if (!conversation) {
    return {
      success: true,
      data: { messages: [], freeRepliesUsed: 0, isUnlocked: false, limitReached: false },
    };
  }

  const { data: messages, error: msgError } = await supabase
    .from("salomon_messages")
    .select("role, content")
    .eq("conversation_id", conversation.id)
    .order("created_at", { ascending: true });

  if (msgError) return { success: false, error: msgError.message };

  return {
    success: true,
    data: {
      messages: (messages ?? []) as SalomonMessage[],
      freeRepliesUsed: conversation.free_replies_used,
      isUnlocked: conversation.is_unlocked,
      limitReached: !conversation.is_unlocked && conversation.free_replies_used >= FREE_REPLY_CAP,
    },
  };
}