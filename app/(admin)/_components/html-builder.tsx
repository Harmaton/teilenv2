const ACCENT = "#FF5A1F";

function escapeHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildBarChart(title: string, data: { label: string; value: number }[]) {
  const barHeight = 26;
  const gap = 12;
  const chartWidth = 480;
  const labelWidth = 140;
  const barMaxWidth = chartWidth - labelWidth - 50;
  const height = data.length * (barHeight + gap);

  const bars = data
    .map((d, i) => {
      const y = i * (barHeight + gap);
      const w = (d.value / 100) * barMaxWidth;
      return `
        <text x="0" y="${y + barHeight / 2 + 4}" font-size="12" fill="#333">${escapeHtml(d.label)}</text>
        <rect x="${labelWidth}" y="${y}" width="${barMaxWidth}" height="${barHeight}" rx="6" fill="#f2f2f2" />
        <rect x="${labelWidth}" y="${y}" width="${Math.max(w, 4)}" height="${barHeight}" rx="6" fill="${ACCENT}" />
        <text x="${labelWidth + barMaxWidth + 8}" y="${y + barHeight / 2 + 4}" font-size="12" font-weight="600" fill="#111">${d.value}</text>
      `;
    })
    .join("");

  return `
    <div style="margin: 24px 0;">
      <p style="font-size:13px;font-weight:600;color:#111;margin:0 0 10px;">${escapeHtml(title)}</p>
      <svg viewBox="0 0 ${chartWidth} ${height}" width="100%" height="${height}" xmlns="http://www.w3.org/2000/svg">
        ${bars}
      </svg>
    </div>
  `;
}

function buildRadarChart(title: string, data: { label: string; value: number }[]) {
  const size = 320;
  const center = size / 2;
  const radius = size / 2 - 50;
  const n = data.length;
  if (n < 3) return buildBarChart(title, data); // radar needs 3+ axes to make visual sense

  const angleStep = (2 * Math.PI) / n;
  const pointAt = (i: number, r: number) => {
    const angle = -Math.PI / 2 + i * angleStep;
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
  };

  // Grid rings at 25/50/75/100%
  const rings = [0.25, 0.5, 0.75, 1].map((frac) => {
    const pts = data.map((_, i) => pointAt(i, radius * frac).join(",")).join(" ");
    return `<polygon points="${pts}" fill="none" stroke="#eee" stroke-width="1" />`;
  }).join("");

  // Axis lines + labels
  const axes = data.map((d, i) => {
    const [x, y] = pointAt(i, radius);
    const [lx, ly] = pointAt(i, radius + 22);
    return `
      <line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="#eee" stroke-width="1" />
      <text x="${lx}" y="${ly}" font-size="11" fill="#333" text-anchor="middle">${escapeHtml(d.label)}</text>
    `;
  }).join("");

  // Data polygon
  const dataPts = data.map((d, i) => pointAt(i, (d.value / 100) * radius).join(",")).join(" ");

  return `
    <div style="margin: 24px 0;">
      <p style="font-size:13px;font-weight:600;color:#111;margin:0 0 10px;">${escapeHtml(title)}</p>
      <svg viewBox="0 0 ${size} ${size + 20}" width="100%" height="${size + 20}" xmlns="http://www.w3.org/2000/svg">
        ${rings}
        ${axes}
        <polygon points="${dataPts}" fill="${ACCENT}" fill-opacity="0.25" stroke="${ACCENT}" stroke-width="2" />
      </svg>
    </div>
  `;
}

function renderChart(spec: { type: string; title: string; data: { label: string; value: number }[] }) {
  if (!spec.data?.length) return "";
  switch (spec.type) {
    case "radar":
      return buildRadarChart(spec.title, spec.data);
    case "bar":
    default:
      return buildBarChart(spec.title, spec.data);
  }
}

export function buildReportHtml({
  fragment,
  charts,
  testTitle,
  testDescription,
  userName,
  updatedAt,
}: {
  fragment: string;
  charts?: { type: string; title: string; data: { label: string; value: number }[] }[];
  testTitle: string;
  testDescription?: string | null;
  userName?: string | null;
  updatedAt: string;
}) {
  const formattedDate = new Date(updatedAt).toLocaleDateString("es", {
    day: "numeric", month: "long", year: "numeric",
  });

  const chartsHtml = (charts ?? []).map(renderChart).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  @page { size: A4; margin: 20mm 18mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1a1a1a; line-height: 1.6; padding: 40px 48px; }
  .report-header { border-bottom: 2px solid ${ACCENT}; padding-bottom: 20px; margin-bottom: 28px; }
  .report-header .eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: ${ACCENT}; margin: 0 0 6px; }
  .report-header h1 { font-size: 24px; font-weight: 700; margin: 0 0 6px; color: #111; }
  .report-header .meta { font-size: 12.5px; color: #666; margin: 0; }
  .report-body h2 { font-size: 16px; font-weight: 700; color: #111; margin: 28px 0 10px; padding-bottom: 6px; border-bottom: 1px solid #eee; }
  .report-body h2:first-child { margin-top: 0; }
  .report-body p { font-size: 14px; color: #333; margin: 0 0 12px; }
  .report-body ul, .report-body ol { font-size: 14px; color: #333; margin: 0 0 12px; padding-left: 20px; }
  .report-body li { margin-bottom: 4px; }
  .report-body strong { color: #111; }
  .charts-grid { display: flex; flex-direction: column; gap: 8px; }
  .report-footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; font-size: 10.5px; color: #999; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="report-header">
    <p class="eyebrow">Informe de diagnóstico</p>
    <h1>${escapeHtml(testTitle)}</h1>
    <p class="meta">${userName ? `${escapeHtml(userName)} · ` : ""}Actualizado el ${formattedDate}</p>
  </div>
  <div class="charts-grid">${chartsHtml}</div>
  <div class="report-body">${fragment}</div>
  <div class="report-footer">${testDescription ? escapeHtml(testDescription) : ""}</div>
</body>
</html>`;
}