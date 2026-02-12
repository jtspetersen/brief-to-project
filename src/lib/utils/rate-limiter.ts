/**
 * Simple in-memory IP-based rate limiter.
 *
 * Tracks how many requests each IP has made during the current window
 * (default: per day). Resets automatically when the window expires.
 *
 * Note: This is an in-memory store — it resets when the server restarts.
 * For production at scale you'd use Redis, but for a single-server MVP
 * this is perfectly fine.
 */

interface RateLimitEntry {
  count: number;
  /** Timestamp (ms) when this window started */
  windowStart: number;
}

const DEFAULT_MAX_REQUESTS = 20; // per window
const DEFAULT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

const store = new Map<string, RateLimitEntry>();

/**
 * Check whether a given IP is allowed to make another request.
 * Returns { allowed: true } or { allowed: false, retryAfterMs }.
 */
export function checkRateLimit(
  ip: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS,
  windowMs: number = DEFAULT_WINDOW_MS
): { allowed: true } | { allowed: false; retryAfterMs: number } {
  const now = Date.now();
  const entry = store.get(ip);

  // No entry yet, or window has expired — start fresh
  if (!entry || now - entry.windowStart >= windowMs) {
    store.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }

  // Within window — check count
  if (entry.count < maxRequests) {
    entry.count += 1;
    return { allowed: true };
  }

  // Over limit
  const retryAfterMs = windowMs - (now - entry.windowStart);
  return { allowed: false, retryAfterMs };
}

/**
 * Extract IP address from the request.
 * Checks common headers used by reverse proxies (nginx, Cloudflare, etc.)
 */
export function getClientIp(req: Request): string {
  const headers = req.headers;

  // Check standard forwarding headers
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs — the first is the client
    return forwarded.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  // Fallback — in development this will be "127.0.0.1" or "::1"
  return "unknown";
}
