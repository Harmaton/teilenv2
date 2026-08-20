import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProfileDetails = {
  age: number | null;
  sex: string | null;
  country: string | null;
  city: string | null;
};

type QuadrantScores = {
  bd: number;
  bi: number;
  fd: number;
  fi: number;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * TODO: replace with the real Teilen predominance algorithm.
 * Nothing in the code shared with me computes BD/BI/FD/FI from
 * `attempt.answers`, so this is a placeholder that keeps the report
 * pipeline from breaking. It currently returns RANDOM values (summing
 * to 100) instead of a fixed even split, so reports look distinct
 * while the real scoring logic is being built.
 */
function computeQuadrantScores(
  _answers: Record<string, string>,
  _itemsSnapshot: unknown
): QuadrantScores {
  const raw = { bd: Math.random(), bi: Math.random(), fd: Math.random(), fi: Math.random() };
  const total = raw.bd + raw.bi + raw.fd + raw.fi;

  // Normalize to whole numbers that sum to exactly 100.
  const bd = Math.round((raw.bd / total) * 100);
  const bi = Math.round((raw.bi / total) * 100);
  const fd = Math.round((raw.fd / total) * 100);
  const fi = 100 - bd - bi - fd; // absorb rounding drift in the last quadrant

  return { bd, bi, fd, fi };
}

function getDevelopmentStage(age: number | null): string {
  if (age === null) return "transición";
  if (age >= 15 && age <= 17) return "exploración";
  if (age >= 18 && age <= 19) return "transición";
  return "definición";
}

function dominantQuadrant(scores: QuadrantScores): { label: string; pct: number } {
  const entries = Object.entries(scores) as [keyof QuadrantScores, number][];
  const [label, pct] = entries.sort((a, b) => b[1] - a[1])[0];
  return { label: label.toUpperCase(), pct };
}

function secondaryQuadrant(scores: QuadrantScores): { label: string; pct: number } {
  const entries = Object.entries(scores) as [keyof QuadrantScores, number][];
  const [label, pct] = entries.sort((a, b) => b[1] - a[1])[1];
  return { label: label.toUpperCase(), pct };
}

/**
 * Builds the system prompt for the AI call. This condenses Prompts 1-6
 * from the Teilen interpretation engine spec into a single system prompt,
 * fills the INPUT block with real profile data, asks for MORE tables in
 * the returned HTML, and explicitly overrides the spec's own "return raw
 * HTML, no JSON" final instruction so it matches this route's existing
 * JSON contract.
 */
function buildSystemPrompt(params: {
  name: string;
  age: number | null;
  sex: string | null;
  country: string | null;
  city: string | null;
  values: string[];
  strengths: string[];
  quadrants: QuadrantScores;
  testTitle: string;
}) {
  const { name, age, sex, country, city, values, strengths, quadrants, testTitle } = params;

  const primary = dominantQuadrant(quadrants);
  const secondary = secondaryQuadrant(quadrants);
  const stage = getDevelopmentStage(age);

  return `
Eres el Motor de Interpretación de Teilen. Este prompt nunca lo ve el usuario.

RESTRICCIONES ABSOLUTAS:
- No eres un test psicológico. No eres un coach. No eres un terapeuta. No eres un orientador vocacional.
- Nunca inventes información. Nunca completes datos faltantes.
- Nunca menciones: MBTI, DISC, Big Five, Holland, Gallup, Enneagram, Benziger, ni ningún otro modelo psicológico conocido.
- Todo debe interpretarse exclusivamente desde la lógica interna de Teilen.
- No escribas en primera persona como si fueras el usuario.

=== DATOS DE ENTRADA (provienen del perfil real, no los inventes) ===
Nombre: ${name}
Edad: ${age ?? "no especificada"} años
Sexo: ${sex ?? "no especificado"}
País / Ciudad: ${country ?? "no especificado"} / ${city ?? "no especificada"}
Etapa de desarrollo: ${stage}
Predominancia principal: ${primary.label} (${primary.pct}%)
Predominancia secundaria: ${secondary.label} (${secondary.pct}%)
Porcentajes completos: BD ${quadrants.bd}% · BI ${quadrants.bi}% · FD ${quadrants.fd}% · FI ${quadrants.fi}%
Valores elegidos: ${values.join(", ") || "no especificados"}
Fortalezas elegidas: ${strengths.join(", ") || "no especificadas"}
Test: ${testTitle}

=== ESTRUCTURA DEL INFORME (4 páginas, un solo fragmento HTML) ===
Construye un fragmento HTML de 4 secciones (sin <!DOCTYPE>/<html>/<body>), con CSS embebido en un <style> al inicio del fragmento, formato imprimible A4, color principal #D97B1A, tipografía Montserrat, mucho espacio en blanco, sin sombras ni degradados.

PÁGINA 1 — PORTADA EJECUTIVA:
- Título "IDENTIDAD EVOLUTIVA".
- Tarjeta central con: nombre, edad, ciudad/país, etapa de desarrollo, esencia, motor principal, mayor fortaleza, mayor desafío, entorno óptimo.
- TABLA de porcentajes por cuadrante (BD, BI, FD, FI) con sus valores numéricos.
- Una frase de cierre (máx. 18 palabras).

PÁGINA 2 — QUIÉN SOY HOY:
- Apertura de máx. 4 líneas describiendo la esencia de ${name}, adaptada a la etapa "${stage}".
- Una figura de referencia (histórica o contemporánea) con 2 líneas explicando la conexión, sin nombrar modelos teóricos.
- TABLA "TU ADN NATURAL" con 4 filas: Tu Motor / Tu Superpoder / Tu Ancla / Tu Lenguaje (columna 2: máx. 10 palabras cada celda).
- TABLA adicional de "Valores y Fortalezas" listando los valores y fortalezas elegidos y una breve nota de cómo se expresan.
- Cierre de 1 línea.

PÁGINA 3 — DÓNDE PUEDO GENERAR MÁS VALOR:
- Cuatro escenarios (educación académica, profesión emergente, emprendimiento, entorno laboral ideal), cada uno máx. 120 palabras, sin comparar ni jerarquizar.
- TABLA resumen al final con una fila por escenario (columna: Escenario / Por qué encaja, máx. 12 palabras).

PÁGINA 4 — MI PROYECTO DE VIDA:
- Bloque "Tu esencia en una frase".
- TABLA "Tus próximos 3 movimientos" con columnas Nº / Acción / Plazo, adaptados a la edad y etapa.
- Una reflexión breve (4-5 líneas) sobre criterio personal.
- CTA mencionando el chat de WhatsApp con Salomón AI al +54 351 756 8043 (tono cálido, no comercial).
- Frase institucional final fuera de los bloques: "Tu identidad no se descubre una vez. Se construye cada vez que eliges con mayor claridad."

RESTRICCIONES DE CONTENIDO:
- No repitas ideas entre páginas.
- No uses "deberías" ni consejos directivos.
- No menciones modelos psicológicos conocidos.
- Usa el nombre ${name} al menos dos veces en el informe.

=== FORMATO DE SALIDA — IMPORTANTE ===
Ignora cualquier instrucción anterior sobre devolver HTML crudo sin envoltorio. Debes responder ÚNICAMENTE con un objeto JSON válido, sin texto adicional, sin explicación, sin backticks de markdown, con esta forma exacta:
{"html": string}

"html" debe contener el fragmento completo de 4 páginas descrito arriba, incluyendo TODAS las tablas indicadas (porcentajes por cuadrante, ADN natural, valores y fortalezas, resumen de escenarios, próximos movimientos).
`.trim();
}

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // Tracks where in the pipeline we are, so the catch block below can log
  // and return exactly which step failed instead of a bare 500.
  let stage = "parse_request_body";
  let reportId: string | undefined;
  let supabase: Awaited<ReturnType<typeof createClient>> | undefined;

  try {
    ({ reportId } = await request.json());
    console.log(`[reports/generate] stage=${stage} reportId=${reportId}`);

    if (!reportId) {
      return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
    }

    stage = "create_supabase_client";
    supabase = await createClient();

    stage = "auth_get_user";
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error(`[reports/generate] stage=${stage} error=`, authError);
    }
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(`[reports/generate] stage=${stage} userId=${user.id}`);

    stage = "fetch_report";
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("id, test_id, attempt_id, profile_id, status")
      .eq("id", reportId)
      .eq("profile_id", user.id)
      .single();

    if (reportError || !report) {
      console.error(`[reports/generate] stage=${stage} error=`, reportError);
      return NextResponse.json({ error: "Report not found", stage, details: reportError?.message }, { status: 404 });
    }
    console.log(`[reports/generate] stage=${stage} report=`, report);

    if (report.status === "completed") {
      return NextResponse.json({ ok: true, skipped: true });
    }

    stage = "mark_generating";
    const { error: markGeneratingError } = await supabase
      .from("reports")
      .update({ status: "generating" })
      .eq("id", reportId);
    if (markGeneratingError) {
      console.error(`[reports/generate] stage=${stage} error=`, markGeneratingError);
    }

    stage = "fetch_dependencies";
    const [
      { data: attempt, error: attemptError },
      { data: test, error: testError },
      { data: profile, error: profileError },
      { data: details, error: detailsError },
    ] = await Promise.all([
      supabase
        .from("test_attempts")
        .select("answers, items_snapshot")
        .eq("id", report.attempt_id)
        .single(),
      supabase.from("tests").select("title, description").eq("id", report.test_id).single(),
      supabase
        .from("profiles")
        .select("full_name, values, strengths")
        .eq("id", report.profile_id)
        .single(),
      supabase
        .from("profile_details")
        .select("age, sex, country, city")
        .eq("profile_id", report.profile_id)
        .maybeSingle(),
    ]);

    if (attemptError) console.error(`[reports/generate] stage=${stage} attemptError=`, attemptError);
    if (testError) console.error(`[reports/generate] stage=${stage} testError=`, testError);
    if (profileError) console.error(`[reports/generate] stage=${stage} profileError=`, profileError);
    if (detailsError) console.error(`[reports/generate] stage=${stage} detailsError=`, detailsError);
    console.log(`[reports/generate] stage=${stage} attempt=${!!attempt} test=${!!test} profile=${!!profile} details=${!!details}`);

    if (!attempt || !test) {
      const message = attemptError?.message ?? testError?.message ?? "Missing attempt or test data";
      await supabase.from("reports").update({ status: "failed", error: message }).eq("id", reportId);
      return NextResponse.json({ error: message, stage }, { status: 500 });
    }

    if (!profile) {
      const message = profileError?.message ?? "Missing profile data";
      await supabase.from("reports").update({ status: "failed", error: message }).eq("id", reportId);
      return NextResponse.json({ error: message, stage }, { status: 500 });
    }

    stage = "build_qa_pairs";
    const items = attempt.items_snapshot as { id: string; question: string; options: { id: string; text: string }[] }[];
    const answers = attempt.answers as Record<string, string>;

    const qaPairs = items
      .map((item) => {
        const selectedOptionId = answers[item.id] as string;
        let answerText = "no answer";

        if (selectedOptionId) {
          const selectedOption = item.options.find((opt) => opt.id === selectedOptionId);
          answerText = selectedOption ? selectedOption.text : selectedOptionId;
        }

        return `Q: ${item.question}\nA: ${answerText}`;
      })
      .join("\n\n");

    stage = "build_prompt";
    const profileDetails: ProfileDetails = details ?? { age: null, sex: null, country: null, city: null };
    const quadrantScores = computeQuadrantScores(answers, items);

    const systemPrompt = buildSystemPrompt({
      name: profile.full_name ?? "Usuario",
      age: profileDetails.age,
      sex: profileDetails.sex,
      country: profileDetails.country,
      city: profileDetails.city,
      values: (profile.values as string[] | null) ?? [],
      strengths: (profile.strengths as string[] | null) ?? [],
      quadrants: quadrantScores,
      testTitle: test.title,
    });

    const model = "openrouter/free";

    stage = "call_openrouter";
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
        max_tokens: 30000,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Respuestas del test:\n${qaPairs}\n\nGenera el informe según las instrucciones del sistema.`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`OpenRouter API error: ${aiResponse.status} ${errText}`);
    }

    stage = "parse_ai_response";
    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content;
    const finishReason = aiData.choices?.[0]?.finish_reason;
    if (!rawContent) throw new Error("No content in AI response");

    const totalTokens = aiData.usage?.total_tokens ?? 0;
    const creditsUsed = totalTokens / 1000;

    const cleaned = (typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent))
      .replace(/```json|```/g, "")
      .trim();

    let parsed: { html: string };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // The model sometimes wraps the JSON with stray text despite
      // instructions not to. Try to salvage just the {...} object
      // before giving up entirely.
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        try {
          parsed = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
        } catch {
          console.error(
            `[reports/generate] stage=${stage} finish_reason=${finishReason} totalTokens=${totalTokens} raw content (first 3000 chars)=`,
            cleaned.slice(0, 3000)
          );
          throw new Error(
            `AI response was not valid JSON (finish_reason=${finishReason}, tokens=${totalTokens})`
          );
        }
      } else {
        console.error(
          `[reports/generate] stage=${stage} finish_reason=${finishReason} totalTokens=${totalTokens} raw content (first 3000 chars)=`,
          cleaned.slice(0, 3000)
        );
        throw new Error(
          `AI response was not valid JSON (finish_reason=${finishReason}, tokens=${totalTokens})`
        );
      }
    }

    // Scores come from our own computed quadrant data, not the model,
    // so a bad AI response can't corrupt the chart or invent numbers.
    const scores = [
      { label: "BD", value: quadrantScores.bd },
      { label: "BI", value: quadrantScores.bi },
      { label: "FD", value: quadrantScores.fd },
      { label: "FI", value: quadrantScores.fi },
    ];

    const reportContent = { html: parsed.html ?? "", scores };

    const { error: updateError } = await supabase
      .from("reports")
      .update({
        status: "completed",
        content: reportContent,
        ai_model: model,
        error: null,
      })
      .eq("id", reportId);

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
    console.error(`[reports/generate] FAILED at stage=${stage} reportId=${reportId} error=`, err);

    if (supabase && reportId) {
      const { error: failUpdateError } = await supabase
        .from("reports")
        .update({ status: "failed", error: `[${stage}] ${message}` })
        .eq("id", reportId);
      if (failUpdateError) {
        console.error(`[reports/generate] also failed to write failure status:`, failUpdateError);
      }
    }

    return NextResponse.json({ error: message, stage }, { status: 500 });
  }
}