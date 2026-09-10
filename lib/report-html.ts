import { ReportScore } from "@/_actions/reports";

export type IdentityReportPage = { title: string; html: string };

export function extractIdentityReportPages(document: string): IdentityReportPage[] {
  const pages: IdentityReportPage[] = [];
  const pagePattern = /<section\b[^>]*class=["'][^"']*\breport-page\b[^"']*["'][^>]*>([\s\S]*?)<\/section>/gi;
  let match: RegExpExecArray | null;

  while ((match = pagePattern.exec(document)) && pages.length < 5) {
    const title = match[1].match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? `PÁGINA ${pages.length}`;
    const content = match[1].match(/<div class=["']page-content["'][^>]*>([\s\S]*?)<\/div>\s*<footer/i)?.[1] ?? match[1];
    pages.push({ title: stripTags(title).trim(), html: cleanGeneratedHtml(content) });
  }

  return pages;
}

export function renderIdentityReportHtml(pages: IdentityReportPage[], options: { avatarUrl?: string | null; studentName?: string | null; age?: number | null; city?: string | null; country?: string | null } = {}) {
  const pageMarkup = pages.slice(0, 5).map((page, index) => `
    <section class="report-page report-page-${index}" aria-labelledby="report-page-title-${index}">
      <div class="page-kicker">TEILEN TEENS <span>${index === 0 ? "MAPA DE IDENTIDAD" : `PÁGINA ${index}`}</span></div>
      <header class="page-header">
        <div class="brand-mark"><span class="brand-spark">✦</span> TEILEN TEENS</div>
        <h1 id="report-page-title-${index}">${escapeHtml(page.title)}</h1>
        <div class="title-rule"><i></i></div>
      </header>
      ${buildStudentContext(options)}
      ${index === 0 ? buildIdentityFrameworkVisual() : ""}
      <div class="page-content">${preparePageHtml(page.html, index)}</div>
      ${index === 4 ? buildSalomonFooter() : ""}
      <footer class="page-footer">IDENTIDAD EVOLUTIVA · INFORME PERSONAL</footer>
    </section>
  `).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Identidad evolutiva</title>
<style>
  @page { size: A4 portrait; margin: 0; }
  :root { --orange: #D97B1A; --ink: #25282B; --muted: #6F7479; --warm: #FBF7F2; --line: #E7D8C8; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #fff; color: var(--ink); }
  body { font-family: Montserrat, "Avenir Next", Arial, sans-serif; }
  .report-page { width: 210mm; height: 297mm; padding: 10mm 12mm 11mm; overflow: hidden; position: relative; page-break-after: always; background: #fff; }
  .report-page:last-child { page-break-after: auto; }
  .page-kicker { display: flex; justify-content: space-between; color: var(--muted); font-size: 8px; font-weight: 600; letter-spacing: .14em; }
  .page-kicker span { color: var(--orange); }
  .page-header { text-align: center; margin: 5mm 0 4mm; position: relative; }
  .brand-mark { color: var(--ink); font-size: 9px; letter-spacing: .28em; font-weight: 500; }
  .brand-spark { color: var(--orange); font-size: 18px; vertical-align: -2px; }
  .page-header h1 { margin: 3mm auto 1.5mm; max-width: 178mm; color: var(--orange); font-family: Georgia, "Times New Roman", serif; font-size: 27px; font-weight: 400; letter-spacing: .02em; text-transform: uppercase; }
  .title-rule { height: 1px; width: 92mm; margin: 0 auto; background: var(--orange); position: relative; }
  .title-rule i { position: absolute; left: 50%; top: -3px; width: 7px; height: 7px; border-radius: 50%; background: var(--orange); }
  .page-content { font-size: 9.6pt; line-height: 1.36; }
  .student-context { display: flex; align-items: center; justify-content: center; gap: 3mm; margin: 0 auto 3mm; color: var(--muted); font-size: 8.5px; }
  .student-context img { width: 14mm; height: 14mm; border-radius: 50%; object-fit: cover; border: 1px solid var(--line); }
  .student-context strong { color: var(--ink); font-family: Georgia, serif; font-size: 14px; }
  .student-context span { padding-left: 3mm; border-left: 1px solid var(--line); }
  .page-content h2, .page-content h3 { color: var(--orange); font-size: 12px; line-height: 1.2; margin: 3mm 0 1.5mm; text-transform: uppercase; }
  .page-content h2:first-child, .page-content h3:first-child { margin-top: 0; }
  .page-content p { margin: 0 0 1.8mm; }
  .page-content ul, .page-content ol { margin: 1mm 0 2mm; padding-left: 5mm; }
  .page-content li { margin-bottom: .8mm; }
  .page-content blockquote { margin: 3mm 0; padding: 4mm 7mm; border: .7pt solid var(--line); border-radius: 12px; background: var(--warm); color: #45403a; font-family: Georgia, serif; font-size: 13px; font-style: italic; text-align: center; }
  .report-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3mm; }
  .report-grid.three, .report-grid[data-columns="3"] { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2.5mm; }
  .report-grid.four, .report-grid[data-columns="4"] { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .report-card, .report-callout { border: .7pt solid var(--line); border-radius: 12px; padding: 3mm; background: #fff; break-inside: avoid; }
  .report-card { position: relative; padding-left: 12mm; }
  .box-icon { position: absolute; left: 3mm; top: 3mm; display: grid; place-items: center; width: 6mm; height: 6mm; color: var(--orange); }
  .box-icon svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
  .report-card h3 { margin-top: 0; font-size: 10px; }
  .report-card p:last-child, .report-callout p:last-child { margin-bottom: 0; }
  .report-pill { display: inline-block; margin: 0 1.5mm 1.5mm 0; padding: 1.5mm 3mm; border-radius: 99px; background: var(--warm); color: var(--orange); font-size: 8.5px; font-weight: 600; }
  .report-callout { margin: 3mm 0; background: var(--warm); border-left: 3px solid var(--orange); }
  .report-callout { position: relative; padding-left: 12mm; }
  .report-callout::before { content: "✦"; position: absolute; left: 3mm; top: 3mm; color: var(--orange); font-size: 14px; }
  .salomon-callout { display: grid; grid-template-columns: 1fr; gap: 1mm; }
  .salomon-callout strong { color: var(--orange); font-size: 10px; letter-spacing: .08em; }
  .salomon-callout b { color: var(--orange); }
  .report-page-0 .page-content { font-size: 8.9pt; line-height: 1.28; }
  .framework-visual { position: relative; height: 43mm; margin: 0 auto 2mm; max-width: 174mm; }
  .framework-visual svg { display: block; width: 100%; height: 100%; }
  .framework-core { position: absolute; left: 50%; top: 50%; width: 34mm; height: 34mm; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1.5px solid var(--orange); border-radius: 50%; background: #fff; text-align: center; }
  .framework-core strong { color: var(--ink); font-family: Georgia, serif; font-size: 13px; line-height: 1.05; text-transform: uppercase; }
  .framework-core span { margin-top: 1.5mm; color: var(--orange); font-family: Georgia, serif; font-size: 11px; font-style: italic; }
  .framework-node { position: absolute; width: 27mm; height: 11mm; padding: 1.5mm; border: .7pt solid var(--line); border-radius: 9px; background: #fff; color: var(--orange); font-size: 7px; font-weight: 600; text-align: center; text-transform: uppercase; }
  .framework-node strong { display: block; color: var(--ink); font-size: 8px; }
  .framework-node.n1 { left: 3%; top: 1%; } .framework-node.n2 { right: 3%; top: 1%; }
  .framework-node.n3 { left: 0; top: 39%; } .framework-node.n4 { right: 0; top: 39%; }
  .framework-node.n5 { left: 14%; bottom: 0; } .framework-node.n6 { right: 14%; bottom: 0; }
  .report-page-0 .report-card { min-height: 20mm; }
  .report-page-0 .report-grid { gap: 3mm; }
  .report-page-0 .report-callout { min-height: 16mm; }
  .report-page-3 .report-grid { gap: 4mm; }
  .report-page-4 { counter-reset: life-section; }
  .report-page-4 .page-content h2 { counter-increment: life-section; }
  .report-page-4 .page-content h2::before { content: counter(life-section) ". "; }
  .report-page-4 .report-card { min-height: 25mm; }
  .salomon-callout { border-left-color: var(--orange); background: var(--warm); }
  .salomon-footer { margin: 3mm 0 0; padding: 4mm 6mm; display: grid; grid-template-columns: 10mm 1fr auto; align-items: center; gap: 4mm; border: .8pt solid var(--line); border-left: 4px solid var(--orange); border-radius: 12px; background: var(--warm); }
  .salomon-footer .salomon-icon { display: grid; place-items: center; width: 9mm; height: 9mm; border-radius: 50%; background: var(--orange); color: white; font-size: 15px; }
  .salomon-footer strong { display: block; color: var(--orange); font-size: 10px; letter-spacing: .08em; }
  .salomon-footer p { margin: 1mm 0 0; color: var(--ink); font-size: 9pt; line-height: 1.3; }
  .salomon-footer .phone { color: var(--orange); font-size: 11pt; font-weight: 700; white-space: nowrap; }
  .report-page-4 .page-footer { bottom: 6mm; }
  .page-footer { position: absolute; bottom: 7mm; left: 12mm; right: 12mm; padding-top: 2mm; border-top: .5pt solid var(--line); color: var(--muted); font-size: 7.5px; text-align: center; letter-spacing: .08em; }
  @media screen { .report-page { margin: 20px auto; box-shadow: 0 0 0 1px #eee; } body { background: #f7f7f6; } }
  @media print { .report-page { margin: 0; } }
</style>
</head>
<body>${pageMarkup}</body>
</html>`;
}

function cleanGeneratedHtml(html: string) {
  return html
    .replace(/<span\b[^>]*class=["'][^"']*\bbox-icon\b[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(["']).*?\1/gi, "");
}

function buildStudentContext(options: { avatarUrl?: string | null; studentName?: string | null; age?: number | null; city?: string | null; country?: string | null }) {
  const name = options.studentName?.trim();
  const location = [options.city, options.country].filter(Boolean).join(", ");
  if (!name && !options.avatarUrl && !options.age && !location) return "";
  return `<div class="student-context">${options.avatarUrl ? `<img src="${escapeHtml(options.avatarUrl)}" alt="Avatar de ${escapeHtml(name ?? "estudiante")}" />` : ""}<strong>${escapeHtml(name ?? "Estudiante")}</strong>${options.age ? `<span>${options.age} años</span>` : ""}${location ? `<span>${escapeHtml(location)}</span>` : ""}</div>`;
}

function decorateGeneratedHtml(html: string, pageIndex: number) {
  let iconIndex = 0;
  return html.replace(/<h3\b([^>]*)>([\s\S]*?)<\/h3>/gi, (_match, attributes, heading) => {
    const icon = iconForHeading(`${heading} ${pageIndex} ${iconIndex++}`);
    return `<h3${attributes}><span class="box-icon">${icon}</span>${heading}</h3>`;
  });
}

function preparePageHtml(html: string, pageIndex: number) {
  let prepared = cleanGeneratedHtml(html);
  if (pageIndex === 4) {
    prepared = prepared
      .replace(/<p\b[^>]*>[\s\S]*?salom[oó]n\s*ai[\s\S]*?<\/p>/gi, "")
      .replace(/<h[23]\b[^>]*>[\s\S]*?salom[oó]n\s*ai[\s\S]*?<\/h[23]>/gi, "");
  }
  return decorateGeneratedHtml(prepared, pageIndex);
}

function buildSalomonFooter() {
  return `<div class="salomon-footer">
    <div class="salomon-icon">✦</div>
    <div><strong>PROFUNDIZA TU PROCESO</strong><p>Reconoce que el crecimiento es continuo y requiere paciencia y apertura. Trabaja tus tensiones internas para enfrentar desafíos con resiliencia. Tu identidad se construye eligiendo con claridad.</p></div>
    <div class="phone">+54 351<br />756 8043</div>
  </div>`;
}

function iconForHeading(value: string) {
  const text = value.toLowerCase();
  let path = "M12 3v18M3 12h18";
  if (/valor|respeto|empat|impact|persona/.test(text)) path = "M20 12c0 5-8 9-8 9s-8-4-8-9a4 4 0 0 1 8-2 4 4 0 0 1 8 2Z";
  else if (/habil|talento|creativ|innov|idea/.test(text)) path = "M9 18h6M10 22h4M8 14a7 7 0 1 1 8 0c-1 1-2 2-2 4h-4c0-2-1-3-2-4Z";
  else if (/aprend|pens|razon|anal/.test(text)) path = "M4 5h6a4 4 0 0 1 4 4v10a4 4 0 0 0-4-4H4zM20 5h-6v14h6z";
  else if (/proyec|escenar|futuro|entorno/.test(text)) path = "M4 20h16M6 17l4-5 3 3 5-8M18 7h-4M18 7v4";
  else if (/cuidado|frena|ajust|watch/.test(text)) path = "M12 3 3 7v5c0 5 4 8 9 9 5-1 9-4 9-9V7zM12 9v4M12 16h.01";
  else if (/vida|mov|acción|orient/.test(text)) path = "M12 3v18M3 12h18M12 3l3 3M12 3 9 6M12 21l3-3M12 21l-3-3";
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}" /></svg>`;
}

function buildIdentityFrameworkVisual() {
  return `<div class="framework-visual" aria-label="Mapa visual de identidad">
    <svg viewBox="0 0 700 220" role="img" aria-hidden="true">
      <circle cx="350" cy="110" r="82" fill="none" stroke="#E7D8C8" stroke-width="7" />
      <circle cx="350" cy="110" r="58" fill="none" stroke="#D97B1A" stroke-width="1.5" />
      <path d="M350 28V52 M350 168V192 M268 110H242 M432 110H458 M292 52L278 38 M408 52L422 38" stroke="#D97B1A" stroke-width="1.5" stroke-dasharray="3 5" />
      <circle cx="350" cy="28" r="6" fill="#D97B1A" /><circle cx="350" cy="192" r="6" fill="#D97B1A" />
      <circle cx="242" cy="110" r="6" fill="#D97B1A" /><circle cx="458" cy="110" r="6" fill="#D97B1A" />
      <circle cx="278" cy="38" r="6" fill="#D97B1A" /><circle cx="422" cy="38" r="6" fill="#D97B1A" />
      <path d="M350 73l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="#D97B1A" opacity=".95" />
    </svg>
    <div class="framework-core"><strong>Identidad</strong><span>en evolución</span></div>
    <div class="framework-node n1"><strong>Talento</strong>lo que aparece</div>
    <div class="framework-node n2"><strong>Habilidades</strong>lo que haces</div>
    <div class="framework-node n3"><strong>Aprendizaje</strong>cómo incorporas</div>
    <div class="framework-node n4"><strong>Cuidado</strong>lo que observas</div>
    <div class="framework-node n5"><strong>Valores</strong>lo que sostiene</div>
    <div class="framework-node n6"><strong>Proyección</strong>hacia dónde pruebas</div>
  </div>`;
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, "");
}

export function buildReportHtml({
  fragment,
  scores,
  testTitle,
  testDescription,
  userName,
  updatedAt,
  avatarUrl,
  age,
  city,
  country,
}: {
  fragment: string;
  scores?: ReportScore[];
  testTitle: string;
  testDescription?: string | null;
  userName?: string | null;
  updatedAt: string;
  avatarUrl?: string | null;
  age?: number | null;
  city?: string | null;
  country?: string | null;
}) {
  if (fragment.trimStart().startsWith("<!DOCTYPE html>")) {
    const pages = extractIdentityReportPages(fragment);
    return pages.length === 5 ? renderIdentityReportHtml(pages, { avatarUrl, studentName: userName, age, city, country }) : fragment;
  }
  const ACCENT = "#FF5A1F";
  const formattedDate = new Date(updatedAt).toLocaleDateString("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const chartHtml = scores && scores.length ? buildScoreChart(scores) : "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  @page { size: A4; margin: 20mm 18mm; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #1a1a1a;
    line-height: 1.6;
    padding: 40px 48px;
  }
  .report-header {
    border-bottom: 2px solid ${ACCENT};
    padding-bottom: 20px;
    margin-bottom: 28px;
  }
  .report-header .eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${ACCENT};
    margin: 0 0 6px;
  }
  .report-header h1 {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 6px;
    color: #111;
  }
  .report-header .meta {
    font-size: 12.5px;
    color: #666;
    margin: 0;
  }
  .report-body h2 {
    font-size: 16px;
    font-weight: 700;
    color: #111;
    margin: 28px 0 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid #eee;
  }
  .report-body h2:first-child { margin-top: 0; }
  .report-body p {
    font-size: 14px;
    color: #333;
    margin: 0 0 12px;
  }
  .report-body ul, .report-body ol {
    font-size: 14px;
    color: #333;
    margin: 0 0 12px;
    padding-left: 20px;
  }
  .report-body li { margin-bottom: 4px; }
  .report-body strong { color: #111; }
  .report-footer {
    margin-top: 40px;
    padding-top: 16px;
    border-top: 1px solid #eee;
    font-size: 10.5px;
    color: #999;
  }
  @media print {
    body { padding: 0; }
  }
</style>
</head>
<body>
  <div class="report-header">
    <p class="eyebrow">Informe de diagnóstico</p>
    <h1>${escapeHtml(testTitle)}</h1>
    <p class="meta">
      ${userName ? `${escapeHtml(userName)} · ` : ""}Actualizado el ${formattedDate}
    </p>
  </div>
  <div class="report-body">
    ${fragment}
    ${chartHtml}
  </div>
  <div class="report-footer">
    ${testDescription ? escapeHtml(testDescription) : ""}
  </div>
</body>
</html>`;


}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}



function buildScoreChart(scores: { label: string; value: number }[]) {
  if (!scores.length) return "";

  const barHeight = 28;
  const gap = 14;
  const chartWidth = 480;
  const labelWidth = 140;
  const barMaxWidth = chartWidth - labelWidth - 50;
  const height = scores.length * (barHeight + gap);
  const ACCENT = "#FF5A1F";

  const bars = scores
    .map((s, i) => {
      const y = i * (barHeight + gap);
      const w = (s.value / 100) * barMaxWidth;
      return `
        <text x="0" y="${y + barHeight / 2 + 4}" font-size="12" fill="#333">${escapeHtml(s.label)}</text>
        <rect x="${labelWidth}" y="${y}" width="${barMaxWidth}" height="${barHeight}" rx="6" fill="#f2f2f2" />
        <rect x="${labelWidth}" y="${y}" width="${Math.max(w, 4)}" height="${barHeight}" rx="6" fill="${ACCENT}" />
        <text x="${labelWidth + barMaxWidth + 8}" y="${y + barHeight / 2 + 4}" font-size="12" font-weight="600" fill="#111">${s.value}</text>
      `;
    })
    .join("");

  return `
    <div style="margin: 24px 0;">
      <svg viewBox="0 0 ${chartWidth} ${height}" width="100%" height="${height}" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
        ${bars}
      </svg>
    </div>
  `;
}