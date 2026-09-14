import nodemailer from "nodemailer";
import { chromium } from "playwright";

const smtpPort = Number(process.env.SMTP_PORT ?? 2525);

function getTransporter() {
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  if (!user || !password) throw new Error("SMTP_USER and SMTP_PASSWORD are required");

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp-pulse.com",
    port: smtpPort,
    secure: process.env.SMTP_SECURE === "true" || smtpPort === 465,
    auth: { user, pass: password },
  });
}

export async function emailReportPdf(input: {
  recipient: string;
  studentName?: string | null;
  reportHtml: string;
  reportId: string;
}) {
  const transporter = getTransporter();
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    headless: true,
  });

  try {
    const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
    await page.setContent(input.reportHtml, { waitUntil: "networkidle" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: input.recipient,
      subject: "Tu informe de Identidad Evolutiva",
      text: `Hola${input.studentName ? ` ${input.studentName}` : ""}. Adjuntamos tu informe de Identidad Evolutiva en PDF. También puedes verlo desde tu cuenta en Teilen Teens.`,
      html: `<p>Hola${input.studentName ? ` ${escapeHtml(input.studentName)}` : ""}.</p><p>Adjuntamos tu informe de Identidad Evolutiva en PDF. También puedes verlo desde tu cuenta en Teilen Teens.</p><p>Tu identidad se construye eligiendo con claridad.</p>`,
      attachments: [{ filename: `identidad-evolutiva-${input.reportId}.pdf`, content: pdf, contentType: "application/pdf" }],
    });
  } finally {
    await browser.close();
  }
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
}
