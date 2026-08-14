import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const OPENROUTER_MODEL = "openrouter/free";

const STYLE_INSTRUCTIONS: Record<string, string> = {
  concise: "Haz el informe más conciso y directo, sin perder la información clave.",
  formal: "Ajusta el tono para que sea más formal y profesional.",
  motivational: "Haz que el tono sea más cálido, motivador y cercano para un joven.",
  detailed: "Amplía cada sección con más detalle y ejemplos concretos.",
};

export async function POST(request: NextRequest) {
  const { reportId, styleId, instruction } = await request.json();

  if (!reportId || (!styleId && !instruction)) {
    return NextResponse.json({ error: "Missing reportId or edit instruction" }, { status: 400 });
  }

  const resolvedInstruction = styleId ? STYLE_INSTRUCTIONS[styleId] : instruction;
  if (!resolvedInstruction) {
    return NextResponse.json({ error: "Unknown style preset" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: report, error: reportError } = await supabase
    .from("reports")
    .select("id, content, status, profile_id")
    .eq("id", reportId)
    .eq("profile_id", user.id)
    .single();

  if (reportError || !report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  if (report.status !== "completed") {
    return NextResponse.json({ error: "El informe aún no está listo para editar." }, { status: 400 });
  }

  try {
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY!}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://theartsoko.com",
        "X-Title": "Report Editing",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        max_tokens: 2000,
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente que edita informes de diagnóstico de talento juvenil. " +
              "Recibirás un fragmento HTML actual y una instrucción de edición. " +
              "Aplica la instrucción manteniendo la información factual del informe. " +
              "Responde ÚNICAMENTE con el fragmento HTML editado (sin <!DOCTYPE>, <html>, <head> ni <body>), " +
              "usando <p>, <h2>, <ul> según corresponda. No incluyas texto fuera del HTML.",
          },
          {
            role: "user",
            content: `Fragmento HTML actual:\n${report.content}\n\nInstrucción de edición:\n${resolvedInstruction}`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`OpenRouter API error: ${aiResponse.status} ${errText}`);
    }

    const aiData = await aiResponse.json();
const rawContent = aiData.choices?.[0]?.message?.content;
if (!rawContent) throw new Error("No content in AI response");

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
    ai_model: OPENROUTER_MODEL,
    error: null,
    }).eq("id", reportId);

    if (updateError) throw new Error(updateError.message);

    return NextResponse.json({ ok: true, content: reportContent });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown edit error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}