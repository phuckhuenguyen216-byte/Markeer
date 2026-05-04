/* ─────────────────────────────────────────────
   In-memory rate limiter (per IP)
   ───────────────────────────────────────────── */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  },
  5 * 60 * 1000,
);

/**
 * Check if a request is rate-limited.
 * @param key   - unique identifier (e.g. IP address)
 * @param limit - max requests allowed in the window
 * @param windowMs - time window in milliseconds
 * @returns { limited, remaining, resetAt }
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { limited: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: limit - 1, resetAt: now + windowMs };
  }

  entry.count++;
  if (entry.count > limit) {
    return { limited: true, remaining: 0, resetAt: entry.resetAt };
  }

  return {
    limited: false,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
  };
}

/** Extract client IP from request headers */
export function getClientIp(request: Request): string {
  const forwarded = (request.headers.get("x-forwarded-for") || "")
    .split(",")[0]
    ?.trim();
  const real = request.headers.get("x-real-ip");
  return forwarded || real || "unknown";
}
