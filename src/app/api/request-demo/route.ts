/**
 * POST /api/request-demo
 *
 * Handles demo access request form submissions.
 * Validates inputs, checks honeypot, rate-limits, and sends notification email.
 */

import { checkRateLimit, getClientIp } from "@/lib/utils/rate-limiter";
import { sendDemoRequestNotification } from "@/lib/utils/email";

const DEMO_REQUEST_MAX = 5; // max requests per IP
const DEMO_REQUEST_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: Request) {
  try {
    // Rate limit: max 5 requests per IP per hour
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(
      `demo-request:${ip}`,
      DEMO_REQUEST_MAX,
      DEMO_REQUEST_WINDOW_MS
    );

    if (!rateCheck.allowed) {
      return Response.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, message, honeypot } = body;

    // Honeypot check — if filled in, silently accept (bot caught)
    if (honeypot) {
      return Response.json({ success: true });
    }

    // Validate required fields
    if (!name?.trim()) {
      return Response.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email?.trim() || !email.includes("@")) {
      return Response.json({ error: "A valid email is required." }, { status: 400 });
    }

    // Send notification email (gracefully falls back to console log if not configured)
    try {
      await sendDemoRequestNotification({
        name: name.trim(),
        email: email.trim(),
        message: message?.trim() || undefined,
      });
    } catch (emailError) {
      console.error("[Demo Request] Email send failed:", emailError);
      // Still return success to the user — their request was received
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
