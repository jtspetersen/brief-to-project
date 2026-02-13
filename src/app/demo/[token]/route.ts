import { NextResponse, type NextRequest } from "next/server";
import { getToken, isTokenValid, incrementSession } from "@/lib/utils/demo-tokens";
import {
  DEMO_COOKIE_NAME,
  createCookieValue,
  getCookieOptions,
} from "@/lib/utils/demo-cookie";

/**
 * GET /demo/[token] — validates a demo token and grants access.
 *
 * If the token is valid and has sessions remaining:
 *   → Sets a signed session cookie
 *   → Increments the session counter
 *   → Redirects to /app (the live BriefKit experience)
 *
 * If the token is invalid, expired, or used up:
 *   → Redirects to / with an error query param
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token: tokenId } = await params;

  // Build redirect base from forwarded headers (nginx sets these)
  // so redirects go to the public URL, not localhost:3000
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("host") || request.nextUrl.host;
  const basePath = process.env.BASE_PATH || "";
  const origin = `${proto}://${host}`;

  // Look up the token in the JSON file
  const token = await getToken(tokenId);

  if (!token) {
    return NextResponse.redirect(new URL(`${basePath}/?error=invalid`, origin));
  }

  if (!isTokenValid(token)) {
    if (token.status === "expired" || new Date(token.expiresAt) <= new Date()) {
      return NextResponse.redirect(new URL(`${basePath}/?error=expired`, origin));
    }
    if (token.sessionsUsed >= token.maxSessions) {
      return NextResponse.redirect(new URL(`${basePath}/?error=used`, origin));
    }
    return NextResponse.redirect(new URL(`${basePath}/?error=invalid`, origin));
  }

  // Token is valid — set session cookie, increment usage, redirect to app
  await incrementSession(tokenId);

  const response = NextResponse.redirect(new URL(`${basePath}/app`, origin));
  const cookieOpts = getCookieOptions();

  response.cookies.set(DEMO_COOKIE_NAME, await createCookieValue(tokenId), cookieOpts);

  return response;
}
