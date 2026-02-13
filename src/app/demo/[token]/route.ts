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
  const baseUrl = request.nextUrl.origin;

  // Look up the token in the JSON file
  const token = await getToken(tokenId);

  if (!token) {
    return NextResponse.redirect(new URL("/?error=invalid", baseUrl));
  }

  if (!isTokenValid(token)) {
    if (token.status === "expired" || new Date(token.expiresAt) <= new Date()) {
      return NextResponse.redirect(new URL("/?error=expired", baseUrl));
    }
    if (token.sessionsUsed >= token.maxSessions) {
      return NextResponse.redirect(new URL("/?error=used", baseUrl));
    }
    return NextResponse.redirect(new URL("/?error=invalid", baseUrl));
  }

  // Token is valid — set session cookie, increment usage, redirect to app
  await incrementSession(tokenId);

  const response = NextResponse.redirect(new URL("/app", baseUrl));
  const cookieOpts = getCookieOptions();

  response.cookies.set(DEMO_COOKIE_NAME, await createCookieValue(tokenId), cookieOpts);

  return response;
}
