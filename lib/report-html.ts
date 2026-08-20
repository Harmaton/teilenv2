import { ReportScore } from "@/_actions/reports";

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