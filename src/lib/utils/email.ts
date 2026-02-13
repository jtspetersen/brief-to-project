import { Resend } from "resend";

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

interface DemoRequestEmail {
  name: string;
  email: string;
  message?: string;
}

/**
 * Send a notification email when someone requests demo access.
 * Sends to NOTIFY_EMAIL (your personal email) via Resend.
 */
export async function sendDemoRequestNotification({
  name,
  email,
  message,
}: DemoRequestEmail): Promise<void> {
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (!notifyEmail || !process.env.RESEND_API_KEY) {
    console.warn("Email not configured — RESEND_API_KEY or NOTIFY_EMAIL missing");
    console.log("Demo request from:", name, email, message);
    return;
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "BriefKit <onboarding@resend.dev>";

  await getResend().emails.send({
    from: fromAddress,
    to: notifyEmail,
    subject: `BriefKit Demo Request: ${name}`,
    html: [
      `<h2>New Demo Access Request</h2>`,
      `<table style="border-collapse:collapse;">`,
      `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Name</td><td>${escapeHtml(name)}</td></tr>`,
      `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>`,
      message
        ? `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Message</td><td>${escapeHtml(message)}</td></tr>`
        : "",
      `</table>`,
      `<br/><p style="color:#888;font-size:12px;">Sent from the BriefKit showcase page</p>`,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
