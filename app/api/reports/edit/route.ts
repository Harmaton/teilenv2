import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const OPENAI_MODEL = "gpt-4.1-mini";

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
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const reportHtml = (report.content as { html?: string } | null)?.html ?? "";
    const aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        max_output_tokens: 6000,
        input: `Edita solamente el contenido textual del informe HTML. Conserva exactamente cinco elementos .report-page, el diseño, el idioma español, los hechos y la información del estudiante. No añadas scripts, estilos, imágenes externas ni puntuaciones internas.\n\nHTML actual:\n${reportHtml}\n\nInstrucción:\n${resolvedInstruction}`,
        text: {
          format: {
            type: "json_schema",
            name: "edited_identity_report",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: { html: { type: "string" } },
              required: ["html"],
            },
          },
        },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`OpenAI API error: ${aiResponse.status} ${errText}`);
    }

    const aiData = await aiResponse.json();
const rawContent = aiData.output_text ?? aiData.output?.flatMap((item: { content?: { text?: string }[] }) => item.content ?? []).map((part: { text?: string }) => part.text ?? "").join("");
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

    const pageCount = (parsed.html.match(/class=["'][^"']*\breport-page\b[^"']*["']/g) ?? []).length;
    if (pageCount !== 5) {
      throw new Error("Edited report must contain exactly five report pages");
    }

    const reportContent = { html: parsed.html ?? "", scores };

    const { error: updateError } = await supabase.from("reports").update({
      status: "completed",
      content: reportContent,
      ai_model: OPENAI_MODEL,
      error: null,
    }).eq("id", reportId);

    if (updateError) throw new Error(updateError.message);

    return NextResponse.json({ ok: true, content: reportContent });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown edit error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}