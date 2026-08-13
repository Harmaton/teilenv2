export function buildReportHtml({
  fragment,
  testTitle,
  testDescription,
  userName,
  updatedAt,
}: {
  fragment: string;
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