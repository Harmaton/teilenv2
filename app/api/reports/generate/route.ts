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

 const items = attempt.items_snapshot as { id: string; question: string; options: { id: string; text: string }[] }[];
const answers = attempt.answers as Record<string, string>;

const qaPairs = items
  .map((item) => {
    const selectedOptionId = answers[item.id] as string;
    let answerText = "no answer";
    
    if (selectedOptionId) {
      // Find the option with matching ID
      const selectedOption = item.options.find(opt => opt.id === selectedOptionId);
      answerText = selectedOption ? selectedOption.text : selectedOptionId;
    }
    
    return `Q: ${item.question}\nA: ${answerText}`;
  })
  .join("\n\n");

console.log('qa pairs', qaPairs);

  const model = "openrouter/free";

  try {
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY!}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "",
        "X-Title": "Talent Diagnostic Reports",
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
      messages: [
  {
    role: "system",
    content:
      "Eres un asistente que genera informes de diagnóstico de talento juvenil. " +
      "Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, con esta forma exacta: " +
      '{"html": string, "scores": [{"label": string, "value": number}]}. ' +
      '"html" es un fragmento HTML (sin <!DOCTYPE>/<html>/<body>) con un <p> de resumen y secciones <h2>/<p>. ' +
      '"scores" son 3 a 6 categorías evaluadas con un valor de 0 a 100 según las respuestas.',
  },
  {
    role: "user",
    content: `Test: ${test.title}\n${test.description ?? ""}\n\nRespuestas:\n${qaPairs}`,
  },
],
    }),
  });

  console.log('ai Response', aiResponse)

  if (!aiResponse.ok) {
    const errText = await aiResponse.text();
    throw new Error(`OpenRouter API error: ${aiResponse.status} ${errText}`);
  }


    const aiData = await aiResponse.json();
const rawContent = aiData.choices?.[0]?.message?.content;
if (!rawContent) throw new Error("No content in AI response");

  const totalTokens = aiData.usage?.total_tokens ?? 0;
  const creditsUsed = totalTokens / 1000;

const cleaned = (typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent))
  .replace(/```json|```/g, "")
  .trim();

let parsed: { html: string; scores: { label: string; value: number }[] };
try {
  parsed = JSON.parse(cleaned);
} catch {
  throw new Error("AI response was not valid JSON");
}

// Validate scores so a bad model response can't corrupt the chart
const scores = Array.isArray(parsed.scores)
  ? parsed.scores
      .filter((s) => typeof s?.label === "string" && typeof s?.value === "number")
      .map((s) => ({ label: s.label, value: Math.max(0, Math.min(100, s.value)) }))
  : [];

const reportContent = { html: parsed.html ?? "", scores };

    const { error: updateError } = await supabase.from("reports").update({
    status: "completed",
    content: reportContent,
    ai_model: model,
    error: null,
    }).eq("id", reportId);

    if (updateError) throw new Error(updateError.message);

    await supabase.from("ai_credits_usage").insert({
      profile_id: report.profile_id,
      report_id: reportId,
      credits_used: creditsUsed,
      model,
      input_tokens: totalTokens,
      output_tokens: totalTokens, 
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown generation error";
    await supabase.from("reports").update({ status: "failed", error: message }).eq("id", reportId);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}