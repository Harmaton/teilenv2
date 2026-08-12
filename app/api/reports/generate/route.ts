import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { reportId } = await request.json();
  if (!reportId) {
    return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: report, error: reportError } = await supabase
    .from("reports")
    .select("id, test_id, attempt_id, profile_id, status")
    .eq("id", reportId)
    .eq("profile_id", user.id)
    .single();

  if (reportError || !report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  if (report.status === "completed") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  await supabase.from("reports").update({ status: "generating" }).eq("id", reportId);

  const [{ data: attempt }, { data: test }] = await Promise.all([
    supabase
      .from("test_attempts")
      .select("answers, items_snapshot")
      .eq("id", report.attempt_id)
      .single(),
    supabase.from("tests").select("title, description").eq("id", report.test_id).single(),
  ]);

  if (!attempt || !test) {
    await supabase
      .from("reports")
      .update({ status: "failed", error: "Missing attempt or test data" })
      .eq("id", reportId);
    return NextResponse.json({ error: "Missing attempt or test data" }, { status: 500 });
  }

  const items = attempt.items_snapshot as { id: string; question: string }[];
  const answers = attempt.answers as Record<string, unknown>;

  const qaPairs = items
    .map((item) => `Q: ${item.question}\nA: ${JSON.stringify(answers[item.id] ?? "no answer")}`)
    .join("\n\n");

  const model = "gpt-3.5-mini";

  try {
    const aiResponse = await fetch("https://openrouter.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY!}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente que genera informes de diagnóstico de talento juvenil a partir de respuestas de un test. " +
              "Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, con esta forma exacta: " +
              '{"summary": string, "sections": [{"title": string, "body": string}]}',
          },
          {
            role: "user",
            content: `Test: ${test.title}\n${test.description ?? ""}\n\nRespuestas:\n${qaPairs}`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`OpenRouter API error: ${aiResponse.status} ${errText}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content in AI response");

    const textResponse = typeof content === "string" ? content : JSON.stringify(content);
    const cleaned = textResponse.replace(/```json|```/g, "").trim();
    const parsedContent = JSON.parse(cleaned);

    const totalTokens = aiData.usage?.total_tokens ?? 0;
    const creditsUsed = totalTokens / 1000; // adjust to your actual credit conversion

    await supabase.from("reports").update({
      status: "completed",
      content: parsedContent,
      ai_model: model,
      error: null,
    }).eq("id", reportId);

    await supabase.from("ai_credits_usage").insert({
      profile_id: report.profile_id,
      report_id: reportId,
      credits_used: creditsUsed,
      model,
      input_tokens: totalTokens,
      output_tokens: totalTokens, // Assuming output tokens are the same as input tokens for simplicity
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown generation error";
    await supabase.from("reports").update({ status: "failed", error: message }).eq("id", reportId);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}