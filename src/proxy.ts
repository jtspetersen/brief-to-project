import { NextResponse, type NextRequest } from "next/server";
import { DEMO_COOKIE_NAME, parseCookieValue } from "@/lib/utils/demo-cookie";
import { getToken, isTokenValid } from "@/lib/utils/demo-tokens";

/**
 * Proxy that protects /app and /api/chat routes.
 *
 * Checks for a valid signed demo session cookie AND re-validates
 * the token against the store on every request. This ensures that
 * revoking a token immediately kicks out active sessions.
 *
 * - If cookie + token are valid → allow through
 * - If cookie is valid but token was revoked/expired/used → clear cookie + redirect
 * - If cookie is missing or invalid → redirect to / (for pages) or return 401 (for API)
 * - If NEXT_PUBLIC_DISABLE_AUTH=true → skip all checks (dev mode)
 */
export async function proxy(request: NextRequest) {
  // Dev mode bypass — skip auth entirely
  if (process.env.NEXT_PUBLIC_DISABLE_AUTH === "true") {
    return NextResponse.next();
  }

  const cookieValue = request.cookies.get(DEMO_COOKIE_NAME)?.value;
  const tokenId = cookieValue ? await parseCookieValue(cookieValue) : null;

  // Build redirect base from forwarded headers (nginx sets these)
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("host") || request.nextUrl.host;
  const basePath = process.env.BASE_PATH || "";
  const origin = `${proto}://${host}`;

  if (tokenId) {
    // Cookie signature is valid — now re-check the token store
    const token = await getToken(tokenId);

    if (token && isTokenValid(token)) {
      // Token still active — allow through
      return NextResponse.next();
    }

    // Token was revoked, expired, or sessions used up — clear cookie and block
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/api/")) {
      const response = NextResponse.json(
        { error: "Session expired — your demo token is no longer valid." },
        { status: 401 }
      );
      response.cookies.delete(DEMO_COOKIE_NAME);
      return response;
    }

    // Page routes: redirect to showcase with error banner
    const response = NextResponse.redirect(
      new URL(`${basePath}/?error=revoked`, origin)
    );
    response.cookies.delete(DEMO_COOKIE_NAME);
    return response;
  }

  // No valid cookie — block access
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Unauthorized — a valid demo session is required." },
      { status: 401 }
    );
  }

  // Page routes (/app): redirect to showcase page
  return NextResponse.redirect(new URL(`${basePath}/`, origin));
}

export const config = {
  matcher: ["/app/:path*", "/api/chat/:path*"],
};
