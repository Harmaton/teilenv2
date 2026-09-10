import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractIdentityReportPages, renderIdentityReportHtml } from "@/lib/report-html";

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
    .select("id, content, status, profile_id, profiles ( avatar_url )")
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
    const currentPages = extractIdentityReportPages(reportHtml);
    if (currentPages.length !== 5) throw new Error("Stored report does not contain five pages");
    const { data: profileDetails } = await supabase
      .from("profile_details")
      .select("age, city, country")
      .eq("profile_id", report.profile_id)
      .maybeSingle();
    const aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        max_output_tokens: 6000,
        input: `Edita solamente el contenido textual de estas cinco páginas. Devuelve exactamente cinco objetos pages con title y html. No devuelvas HTML de documento, secciones .report-page, CSS, scripts, imágenes ni coordenadas. Conserva el orden, la estructura semántica, el idioma español y los hechos del estudiante.\n\nPÁGINAS ACTUALES:\n${JSON.stringify(currentPages)}\n\nINSTRUCCIÓN:\n${resolvedInstruction}`,
        text: {
          format: {
            type: "json_schema",
            name: "edited_identity_report",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                pages: {
                  type: "array",
                  minItems: 5,
                  maxItems: 5,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: { title: { type: "string" }, html: { type: "string" } },
                    required: ["title", "html"],
                  },
                },
              },
              required: ["pages"],
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

let parsed: { pages: { title: string; html: string }[] };
try {
  parsed = JSON.parse(cleaned);
} catch {
  throw new Error("AI response was not valid JSON");
}

    if (!Array.isArray(parsed.pages) || parsed.pages.length !== 5 || parsed.pages.some((page) => !page.title || !page.html)) {
      throw new Error("Edited report must contain exactly five report pages");
    }

    const avatarUrl = (report.profiles as { avatar_url?: string | null } | null)?.avatar_url ?? null;
    const reportContent = {
      html: renderIdentityReportHtml(parsed.pages, {
        avatarUrl,
        studentName: (report.profiles as { full_name?: string | null } | null)?.full_name,
        age: profileDetails?.age ?? null,
        city: profileDetails?.city ?? null,
        country: profileDetails?.country ?? null,
      }),
      scores: [],
    };

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