/**
 * Demo session cookie utilities.
 *
 * Creates and validates signed cookies that prove a visitor
 * has authenticated via a valid demo token.
 *
 * Cookie value format: "<tokenId>.<timestamp>.<signature>"
 * The signature is an HMAC-SHA256 of "tokenId.timestamp" using DEMO_COOKIE_SECRET.
 *
 * Uses the Web Crypto API (not Node.js crypto) so it works in Edge Runtime (middleware).
 */

/** Cookie name used for demo sessions */
export const DEMO_COOKIE_NAME = "bk-demo-session";

/** Cookie max age in seconds (2 hours, matching session timeout) */
export const DEMO_COOKIE_MAX_AGE = 2 * 60 * 60;

/** Get cookie options for setting the cookie */
export function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: DEMO_COOKIE_MAX_AGE,
    path: "/",
  };
}

function getSecret(): string {
  return process.env.DEMO_COOKIE_SECRET || "dev-secret-not-for-production";
}

const encoder = new TextEncoder();

/** HMAC-SHA256 sign using Web Crypto API (works in Edge Runtime) */
async function sign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));

  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Create a signed cookie value for a demo token.
 * Returns the string to store as the cookie value.
 */
export async function createCookieValue(tokenId: string): Promise<string> {
  const timestamp = Date.now().toString();
  const payload = `${tokenId}.${timestamp}`;
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

/**
 * Parse and validate a demo session cookie value.
 * Returns the token ID if valid, or null if tampered/invalid.
 */
export async function parseCookieValue(value: string): Promise<string | null> {
  const parts = value.split(".");
  if (parts.length !== 3) return null;

  const [tokenId, timestamp, signature] = parts;
  if (!tokenId || !timestamp || !signature) return null;

  // Verify signature
  const payload = `${tokenId}.${timestamp}`;
  const expectedSignature = await sign(payload);

  if (signature !== expectedSignature) return null;

  return tokenId;
}
