import { ReportScore } from "@/_actions/reports";

type IdentityReportPage = { title: string; html: string };

export function renderIdentityReportHtml(pages: IdentityReportPage[]) {
  const pageMarkup = pages.slice(0, 5).map((page, index) => `
    <section class="report-page report-page-${index}" aria-labelledby="report-page-title-${index}">
      <div class="page-kicker">TEILEN TEENS <span>${index === 0 ? "MAPA DE IDENTIDAD" : `PÁGINA ${index}`}</span></div>
      <header class="page-header">
        <div class="brand-mark"><span class="brand-spark">✦</span> TEILEN TEENS</div>
        <h1 id="report-page-title-${index}">${escapeHtml(page.title)}</h1>
        <div class="title-rule"><i></i></div>
      </header>
      <div class="page-content">${cleanGeneratedHtml(page.html)}</div>
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
  .report-page { width: 210mm; height: 297mm; padding: 12mm; overflow: hidden; position: relative; page-break-after: always; background: #fff; }
  .report-page:last-child { page-break-after: auto; }
  .page-kicker { display: flex; justify-content: space-between; color: var(--muted); font-size: 8px; font-weight: 600; letter-spacing: .14em; }
  .page-kicker span { color: var(--orange); }
  .page-header { text-align: center; margin: 8mm 0 5mm; }
  .brand-mark { color: var(--ink); font-size: 9px; letter-spacing: .28em; font-weight: 500; }
  .brand-spark { color: var(--orange); font-size: 18px; vertical-align: -2px; }
  .page-header h1 { margin: 4mm auto 2mm; max-width: 172mm; color: var(--orange); font-family: Georgia, "Times New Roman", serif; font-size: 27px; font-weight: 400; letter-spacing: .02em; text-transform: uppercase; }
  .title-rule { height: 1px; width: 92mm; margin: 0 auto; background: var(--orange); position: relative; }
  .title-rule i { position: absolute; left: 50%; top: -3px; width: 7px; height: 7px; border-radius: 50%; background: var(--orange); }
  .page-content { font-size: 9.2pt; line-height: 1.38; }
  .page-content h2, .page-content h3 { color: var(--orange); font-size: 12px; line-height: 1.2; margin: 4mm 0 2mm; text-transform: uppercase; }
  .page-content h2:first-child, .page-content h3:first-child { margin-top: 0; }
  .page-content p { margin: 0 0 2.5mm; }
  .page-content ul, .page-content ol { margin: 1.5mm 0 3mm; padding-left: 5mm; }
  .page-content li { margin-bottom: 1.2mm; }
  .page-content blockquote { margin: 3mm 0; padding: 4mm 7mm; border: .7pt solid var(--line); border-radius: 12px; background: var(--warm); color: #45403a; font-family: Georgia, serif; font-size: 13px; font-style: italic; text-align: center; }
  .report-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4mm; }
  .report-grid.three, .report-grid[data-columns="3"] { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .report-grid.four, .report-grid[data-columns="4"] { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .report-card, .report-callout { border: .7pt solid var(--line); border-radius: 12px; padding: 4mm; background: #fff; break-inside: avoid; }
  .report-card h3 { margin-top: 0; font-size: 10px; }
  .report-card p:last-child, .report-callout p:last-child { margin-bottom: 0; }
  .report-pill { display: inline-block; margin: 0 1.5mm 1.5mm 0; padding: 1.5mm 3mm; border-radius: 99px; background: var(--warm); color: var(--orange); font-size: 8.5px; font-weight: 600; }
  .report-callout { margin: 3mm 0; background: var(--warm); border-left: 3px solid var(--orange); }
  .report-page-0 .page-content { font-size: 8.8pt; }
  .report-page-0 .report-card { min-height: 28mm; }
  .report-page-0 .report-grid { gap: 3mm; }
  .report-page-0 .report-callout { min-height: 20mm; }
  .report-page-3 .report-grid { gap: 4mm; }
  .report-page-4 .report-card { min-height: 29mm; }
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
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(["']).*?\1/gi, "");
}

export function buildReportHtml({
  fragment,
  scores,
  testTitle,
  testDescription,
  userName,
  updatedAt,
}: {
  fragment: string;
  scores?: ReportScore[];
  testTitle: string;
  testDescription?: string | null;
  userName?: string | null;
  updatedAt: string;
}) {
  if (fragment.trimStart().startsWith("<!DOCTYPE html>")) return fragment;
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