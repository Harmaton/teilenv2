const RESEND_API = "https://api.resend.com";

type ResendSendResult = { id: string };

function getApiKey() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not configured");
  return key;
}

function getFrom() {
  // The sender must be a domain verified in Resend.
  return process.env.RESEND_FROM ?? "Teilen Teens <talento@teilenteens.com>";
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://teilenteens.com").replace(/\/$/, "");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendViaResend(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const response = await fetch(`${RESEND_API}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getFrom(),
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend error ${response.status}: ${detail}`);
  }

  return (await response.json()) as ResendSendResult;
}

/** Strips tags and collapses whitespace so the plain-text part stays readable. */
function toPlainText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Notifies the student that their report is ready.
 *
 * Deliberately sends a small HTML snippet with a link instead of a PDF
 * attachment: rendering a PDF meant launching headless Chromium inside the
 * request, which is not viable on a serverless runtime (bundle size, cold
 * starts, execution timeout) and would base64 the whole document into the
 * Resend payload.
 */
export async function emailReportReady(input: {
  recipient: string;
  studentName?: string | null;
  reportId: string;
  /** Optional short teaser, e.g. the strongest observed trait. */
  teaser?: string | null;
  testTitle?: string | null;
}) {
  const name = input.studentName?.trim();
  const greetingName = name ? `Hola ${escapeHtml(name)}` : "Hola";
  const reportUrl = `${siteUrl()}/reports/${input.reportId}`;
  const title = input.testTitle?.trim() || "Identidad Evolutiva";
  const teaser = input.teaser?.trim();

  const html = `<!DOCTYPE html>
<html lang="es">
  <body style="margin:0;padding:24px 12px;background:#f6f4f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #ece7e1;">
      <tr>
        <td style="height:5px;background:linear-gradient(90deg,#FF5A1F,#FF9A3D);"></td>
      </tr>
      <tr>
        <td style="padding:32px 32px 8px;">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#FF5A1F;font-weight:700;">${escapeHtml(title)}</p>
          <h1 style="margin:0;font-size:22px;line-height:1.3;color:#0f0f0f;font-weight:700;">Tu informe ya está listo</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 32px 0;">
          <p style="margin:0;font-size:15px;line-height:1.65;color:#3f3f46;">${greetingName}, ya terminamos de analizar tus respuestas y preparamos tu informe de Identidad Evolutiva.</p>
          ${teaser ? `<p style="margin:16px 0 0;padding:16px 18px;background:#fff8f3;border-left:3px solid #FF5A1F;border-radius:0 12px 12px 0;font-size:14.5px;line-height:1.6;color:#3f3f46;">${escapeHtml(teaser)}</p>` : ""}
        </td>
      </tr>
      <tr>
        <td style="padding:24px 32px 0;">
          <a href="${reportUrl}" style="display:inline-block;background:#0f0f0f;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:13px 26px;border-radius:999px;">Ver mi informe completo</a>
          <p style="margin:14px 0 0;font-size:12.5px;line-height:1.6;color:#8a8a8a;">Si el botón no funciona, copiá esta dirección:<br><a href="${reportUrl}" style="color:#FF5A1F;word-break:break-all;">${reportUrl}</a></p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px 32px;">
          <div style="border-top:1px solid #f0ece7;padding-top:18px;">
            <p style="margin:0;font-size:12.5px;line-height:1.65;color:#a1a1aa;">Tu identidad no se descubre de una vez. Se construye cada vez que elegís con mayor claridad.</p>
            <p style="margin:10px 0 0;font-size:11.5px;color:#c4c4cc;">Teilen Teens &middot; teilenteens.com</p>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return sendViaResend({
    to: input.recipient,
    subject: "Tu informe de Identidad Evolutiva está listo",
    html,
    text: `${greetingName}, tu informe de Identidad Evolutiva ya está listo. Verlo completo: ${reportUrl}`,
  });
}

/** Generic transactional email. */
export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  return sendViaResend({
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text ?? toPlainText(input.html),
  });
}
