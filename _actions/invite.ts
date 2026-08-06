"use server";

import { createTransporter, generateInviteToken } from "@/lib/helpers";
import { createClient } from "@/lib/supabase/server";

export type InviteResult =
  | { success: true; message: string }
  | { success: false; error: string };

// ── Helpers ───────────────────────────────────────────────────────────────────


function getBaseUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim();
  try {
    return new URL(raw).origin;
  } catch {
    console.warn("[getBaseUrl] Invalid NEXT_PUBLIC_SITE_URL — falling back to http://localhost:3000");
    return "http://localhost:3000";
  }
}

// ── DB checks ─────────────────────────────────────────────────────────────────

async function checkUserExists(email: string): Promise<boolean> {
  const supabase = await createClient();

  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (profileError && profileError.code !== "PGRST116") {
    console.error("[checkUserExists] profiles error:", profileError);
  }
  if (userProfile) return true;

  const { data: pendingInvite, error: pendingError } = await supabase
    .from("pending_invites")
    .select("id")
    .eq("email", email)
    .eq("status", "pending")
    .maybeSingle();

  if (pendingError && pendingError.code !== "PGRST116") {
    console.error("[checkUserExists] pending_invites error:", pendingError);
  }
  if (pendingInvite) return true;

  return false;
}

async function createPendingUser(
  email: string,
  inviteToken: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("pending_invites").insert({
    email: email.toLowerCase(),
    invite_token: inviteToken,
    status: "pending",
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("[createPendingUser] error:", error);
    throw new Error("Failed to store pending invite");
  }
}

// ── Email template ────────────────────────────────────────────────────────────

function buildInviteEmail(email: string, inviteToken: string) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "AICE CMS";
  const baseUrl = getBaseUrl(); // clean, normalised, no trailing slash

  // The actual href must be RFC-compliant — @ in the email must be %40
  const hrefUrl = `${baseUrl}/auth/accept-invite?token=${inviteToken}&email=${encodeURIComponent(email)}`;

  // What the user *reads* in the email — plain @ symbol, no percent-encoding
  const readableUrl = `${baseUrl}/auth/accept-invite?token=${inviteToken}&email=${email}`;

  const expiryDays = 7;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're invited to ${appName}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:12px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(0,0,0,0.07);">

          <!-- Header -->
          <tr>
            <td style="background:#0f172a;padding:36px 48px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;
                         letter-spacing:-0.5px;">${appName}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 48px 32px;">
              <h2 style="margin:0 0 12px;color:#0f172a;font-size:26px;
                         font-weight:700;line-height:1.2;">
                You've been invited!
              </h2>
              <p style="margin:0 0 8px;color:#475569;font-size:16px;line-height:1.6;">
                You've been invited to join <strong>${appName}</strong>.
              </p>
              <p style="margin:0 0 8px;color:#475569;font-size:15px;">
                Invite sent to: <strong style="color:#0f172a;">${email}</strong>
              </p>
              <p style="margin:0 0 32px;color:#94a3b8;font-size:13px;">
                This invite link will expire in <strong>${expiryDays} days</strong>.
              </p>

              <!-- CTA button — href is encoded, button text is clean -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background:#0f172a;">
                    <a href="${hrefUrl}"
                       style="display:inline-block;padding:14px 32px;color:#ffffff;
                              font-size:15px;font-weight:600;text-decoration:none;
                              letter-spacing:0.2px;">
                      Accept Invitation →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Fallback: href encoded, visible text is human-readable -->
          <tr>
            <td style="padding:0 48px 40px;">
              <p style="margin:24px 0 4px;color:#94a3b8;font-size:12px;line-height:1.6;">
                If the button doesn't work, copy and paste this link:
              </p>
              <a href="${hrefUrl}"
                 style="color:#3b82f6;font-size:12px;word-break:break-all;
                        text-decoration:none;line-height:1.8;">
                ${readableUrl}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 48px;
                       border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                Sent by ${appName} ·
                <a href="mailto:${process.env.SMTP_ADMIN_EMAIL}"
                   style="color:#94a3b8;">${process.env.SMTP_ADMIN_EMAIL}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain-text fallback — always human-readable, no % encoding
  const text = `
You've been invited to join ${appName}!

Invitation for: ${email}

Accept your invitation here:
${readableUrl}

This link expires in ${expiryDays} days.

If you didn't expect this email, you can safely ignore it.
  `.trim();

  return { html, text, subject: `You're invited to ${appName}` };
}


export async function sendInviteAction(
  _prevState: InviteResult | null,
  formData: FormData
): Promise<InviteResult> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();

  if (!email) {
    return { success: false, error: "Email address is required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const allowedDomains = ["adanianlabs.io", "aiceafrica.com"];
  const domain = email.split("@")[1];
  if (!allowedDomains.includes(domain)) {
    return {
      success: false,
      error: "Invitations can only be sent to @adanianlabs.io or @aiceafrica.com addresses.",
    };
  }

  try {
    const exists = await checkUserExists(email);
    if (exists) {
      return {
        success: false,
        error: "A user with this email already exists or has a pending invitation.",
      };
    }

    const inviteToken = generateInviteToken();
    await createPendingUser(email, inviteToken);

    const transporter = createTransporter();
    const { subject, html, text } = buildInviteEmail(email, inviteToken);

    await transporter.sendMail({
      from: `"${process.env.NEXT_PUBLIC_APP_NAME ?? "AICE CMS"}" <${process.env.SMTP_ADMIN_EMAIL}>`,
      to: email,
      subject,
      html,
      text,
    });

    return {
      success: true,
      message: `Invitation sent to ${email}. They'll receive an email shortly.`,
    };
  } catch (err) {
    console.error("[sendInviteAction] error:", err);
    return {
      success: false,
      error: "Failed to send the invitation. Please try again.",
    };
  }
}