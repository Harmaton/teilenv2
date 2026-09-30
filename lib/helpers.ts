import crypto from "crypto";

/** Email sending goes through Resend — see @/lib/report-email. */
export async function sendEmailViaResend(input: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const { sendEmail } = await import("@/lib/report-email");
  return sendEmail(input);
}

export function generateInviteToken(): string {
  return crypto.randomBytes(32).toString("hex");
}