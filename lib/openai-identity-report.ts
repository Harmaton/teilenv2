import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { emailReportPdf } from "@/lib/report-email";

export const OPENAI_REPORT_MODEL = "gpt-5.6-terra";

type ProfileDetails = {
  age: number | null;
  sex: string | null;
  country: string | null;
  city: string | null;
};

type ReportPage = {
  title: string;
  html: string;
};

type GeneratedReport = {
  pages: [ReportPage, ReportPage, ReportPage, ReportPage, ReportPage];
};

type ReportRow = {
  id: string;
  test_id: string;
  attempt_id: string | null;
  profile_id: string;
  status: string;
};

const REPORT_SCHEMA = {
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
        properties: {
          title: { type: "string" },
          html: { type: "string" },
        },
        required: ["title", "html"],
      },
    },
  },
  required: ["pages"],
} as const;

function developmentStage(age: number | null) {
  if (age !== null && age <= 17) return "exploración";
  if (age !== null && age <= 19) return "transición";
  return "definición";
}

function buildPrompt(input: {
  name: string;
  details: ProfileDetails;
  values: string[];
  strengths: string[];
  testTitle: string;
  qaPairs: string;
  quadrantScores: unknown;
}) {
  const stage = developmentStage(input.details.age);

  return `Eres el motor interno de interpretación de Teilen Teens. Genera el contenido de un informe de identidad evolutiva para un adolescente o joven. No es un diagnóstico, terapia, test clínico ni una predicción vocacional.

DATOS REALES
Nombre: ${input.name}
Edad: ${input.details.age ?? "no especificada"}
Ciudad: ${input.details.city ?? "no especificada"}
País: ${input.details.country ?? "no especificado"}
Etapa de desarrollo: ${stage}
Valores elegidos: ${input.values.join(", ") || "no especificados"}
Fortalezas elegidas: ${input.strengths.join(", ") || "no especificadas"}
Test: ${input.testTitle}

DATOS INTERNOS DEL MOTOR DE SCORING (NO MOSTRAR NI NOMBRAR EN EL INFORME)
${JSON.stringify(input.quadrantScores)}

RESPUESTAS DEL TEST
${input.qaPairs}

REGLAS DE CONTENIDO
- Escribe en español claro, serio, cálido y apropiado para la edad.
- Usa segunda persona y lenguaje evolutivo: hoy, tiendes a, a menudo, puedes, cuando.
- No inventes hechos, porcentajes, nombres de modelos, diagnósticos ni mecanismos internos del test.
- No muestres puntuaciones, abreviaturas, cuadrantes, porcentajes ni nombres técnicos del sistema.
- No uses “eres único”, “genio”, “dotado”, “puedes lograr cualquier cosa” ni promesas deterministas.
- Integra valores y fortalezas en conductas observables; incluye tensiones y condiciones que pueden frenar el desempeño.
- No repitas una idea entre páginas. Cada página tiene un trabajo distinto.
- No escribas coordenadas, SVG complejo, imágenes externas, scripts ni estilos globales. El renderer ya controla el diseño.
- Devuelve HTML semántico pequeño dentro de cada página: h2, h3, p, ul, ol, blockquote, div class="report-card", div class="report-grid", div class="report-pill" y div class="report-callout".
- El HTML debe ser texto real, sin markdown ni etiquetas de documento.

LAS CINCO PÁGINAS, EN ESTE ORDEN
0. “IDENTIDAD EVOLUTIVA”: resumen visual de 30 segundos. Incluye meta del estudiante, talento predominante, esencia, cuatro habilidades observables, cuatro condiciones para aprender, cuatro aspectos a cuidar, proyección en dos líneas, cuatro valores y tres indicadores: potencia, freno y dónde brillas. Usa tarjetas compactas y una frase final. No agregues análisis nuevo.
1. “QUIÉN SOY HOY”: 130-180 palabras de apertura usando el nombre dos veces; una cita espejo de 18-30 palabras; cuatro tarjetas de personalidad en acción: cómo te mueves, piensas, decides e impactas; cuatro filas de ADN natural; tres patrones recurrentes; tres rasgos que distinguen. No hables de carreras ni acciones futuras.
2. “EN QUÉ ERES BUENO Y CÓMO FUNCIONAS MEJOR”: narrativa de aprendizaje de 140-190 palabras, exactamente cuatro bullets de aprendizaje; cuatro habilidades con expresión observable; narrativa de resolución de 110-160 palabras y exactamente tres condiciones de mejor desempeño; cuatro fricciones concretas y tres ajustes específicos para empezar a trabajarlas. No menciones carreras.
3. “DÓNDE PUEDES GENERAR MÁS VALOR”: cuatro escenarios con el mismo peso y 110-150 palabras cada uno: formación académica con 2-4 familias de estudio, profesión emergente con un rol realista, emprendimiento con estilo y ejemplo concreto, y entorno laboral ideal sin cargo. Cada escenario termina con “Qué necesita de ti”. Nunca digas mejor, recomendado, ideal para ti o deberías.
4. “MI PROYECTO DE VIDA”: frase espejo de 18-30 palabras y explicación de 70-110 palabras; tres orientaciones de 65-95 palabras centradas en criterios; tres acciones observables para las próximas 2-3 semanas que produzcan evidencia; reflexión sobria de 80-120 palabras; termina exactamente con “Tu identidad no se descubre de una vez. Se construye cada vez que eliges con mayor claridad.” No incluyas Salomón AI ni un número de WhatsApp: el renderer añade ese cierre visual de forma fija. No repitas fortalezas, habilidades o escenarios como resumen.

FORMATO
Devuelve solamente JSON válido con exactamente cinco objetos en pages. Cada objeto tiene title y html. No incluyas markdown, explicaciones ni texto fuera del JSON.`;
}

async function generateWithOpenAI(prompt: string): Promise<{ report: GeneratedReport; totalTokens: number }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_REPORT_MODEL,
      temperature: 0.35,
      max_output_tokens: 12000,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: prompt }],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "teilen_identity_evolution_report",
          strict: true,
          schema: REPORT_SCHEMA,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const raw = data.output_text ?? data.output?.flatMap((item: { content?: { text?: string }[] }) => item.content ?? []).map((part: { text?: string }) => part.text ?? "").join("");
  if (!raw) throw new Error("OpenAI returned no report content");

  let report: GeneratedReport;
  try {
    report = JSON.parse(raw) as GeneratedReport;
  } catch {
    throw new Error("OpenAI report response was not valid JSON");
  }

  if (!report.pages || report.pages.length !== 5 || report.pages.some((page) => !page.title || !page.html)) {
    throw new Error("OpenAI report did not contain exactly five valid pages");
  }

  return { report, totalTokens: data.usage?.total_tokens ?? 0 };
}

function qaPairsFromSnapshot(
  snapshot: { id: string; question: string; options: { id: string; text: string }[] }[],
  answers: Record<string, string>
) {
  return snapshot.map((item) => {
    const selected = item.options.find((option) => option.id === answers[item.id]);
    return `Q: ${item.question}\nA: ${selected?.text ?? answers[item.id] ?? "sin respuesta"}`;
  }).join("\n\n");
}

export async function handleOpenAIReportGeneration(request: NextRequest) {
  let reportId: string | undefined;
  let supabase: Awaited<ReturnType<typeof createClient>> | undefined;
  let stage = "parse_request_body";

  try {
    ({ reportId } = await request.json());
    if (!reportId) return NextResponse.json({ error: "Missing reportId" }, { status: 400 });

    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    stage = "fetch_report";
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("id, test_id, attempt_id, profile_id, status")
      .eq("id", reportId)
      .eq("profile_id", user.id)
      .single<ReportRow>();
    if (reportError || !report) return NextResponse.json({ error: "Report not found" }, { status: 404 });
    if (report.status === "completed") return NextResponse.json({ ok: true, skipped: true });

    await supabase.from("reports").update({ status: "generating", error: null }).eq("id", reportId);

    stage = "fetch_dependencies";
    const [{ data: attempt }, { data: test }, { data: profile }, { data: details }] = await Promise.all([
      supabase.from("test_attempts").select("answers, items_snapshot, quadrant_scores").eq("id", report.attempt_id).single(),
      supabase.from("tests").select("title").eq("id", report.test_id).single(),
      supabase.from("profiles").select("email, full_name, avatar_url, values, strengths").eq("id", report.profile_id).single(),
      supabase.from("profile_details").select("age, sex, country, city").eq("profile_id", report.profile_id).maybeSingle(),
    ]);
    if (!attempt || !test || !profile) throw new Error("Missing report dependencies");

    stage = "call_openai_responses";
    const profileDetails: ProfileDetails = details ?? { age: null, sex: null, country: null, city: null };
    const prompt = buildPrompt({
      name: profile.full_name ?? "Usuario",
      details: profileDetails,
      values: (profile.values as string[] | null) ?? [],
      strengths: (profile.strengths as string[] | null) ?? [],
      testTitle: test.title,
      quadrantScores: attempt.quadrant_scores ?? {},
      qaPairs: qaPairsFromSnapshot(
        (attempt.items_snapshot as { id: string; question: string; options: { id: string; text: string }[] }[]) ?? [],
        (attempt.answers as Record<string, string>) ?? {},
      ),
    });
    const { report: generated, totalTokens } = await generateWithOpenAI(prompt);

    stage = "render_report";
    const { renderIdentityReportHtml } = await import("@/lib/report-html");
    const html = renderIdentityReportHtml(generated.pages, {
      avatarUrl: profile.avatar_url,
      studentName: profile.full_name,
      age: profileDetails.age,
      city: profileDetails.city,
      country: profileDetails.country,
    });
    const content = { html, scores: [] };

    const { error: updateError } = await supabase.from("reports").update({
      status: "completed",
      content,
      ai_model: OPENAI_REPORT_MODEL,
      error: null,
    }).eq("id", reportId);
    if (updateError) throw new Error(updateError.message);

    await supabase.from("notifications").insert({
      profile_id: report.profile_id,
      title: "Tu informe está listo",
      body: "Ya puedes consultar tu Identidad Evolutiva.",
      type: "success",
      href: `/reports/${reportId}`,
    });

    if (profile.email) {
      try {
        await emailReportPdf({
          recipient: profile.email,
          studentName: profile.full_name,
          reportHtml: html,
          reportId,
        });
        await supabase.from("notifications").insert({
          profile_id: report.profile_id,
          title: "Informe enviado por correo",
          body: "Revisa tu bandeja de entrada para descargar el PDF.",
          type: "info",
          href: `/reports/${reportId}`,
        });
      } catch (emailError) {
        console.error("[report-email] failed", emailError);
        await supabase.from("notifications").insert({
          profile_id: report.profile_id,
          title: "No pudimos enviar el PDF por correo",
          body: "Puedes descargarlo desde tu cuenta de Teilen Teens.",
          type: "warning",
          href: `/reports/${reportId}`,
        });
      }
    }

    await supabase.from("ai_credits_usage").insert({
      profile_id: report.profile_id,
      report_id: reportId,
      credits_used: totalTokens / 1000,
      model: OPENAI_REPORT_MODEL,
      input_tokens: totalTokens,
      output_tokens: totalTokens,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown generation error";
    console.error(`[reports/openai/generate] FAILED stage=${stage} reportId=${reportId}`, error);
    if (supabase && reportId) {
      await supabase.from("reports").update({ status: "failed", error: `[${stage}] ${message}` }).eq("id", reportId);
      const { data: failedReport } = await supabase.from("reports").select("profile_id").eq("id", reportId).maybeSingle();
      if (failedReport?.profile_id) {
        await supabase.from("notifications").insert({
          profile_id: failedReport.profile_id,
          title: "No pudimos generar tu informe",
          body: "Puedes intentarlo de nuevo desde la sección de informes.",
          type: "error",
          href: `/reports/${reportId}`,
        });
      }
    }
    return NextResponse.json({ error: message, stage }, { status: 500 });
  }
}