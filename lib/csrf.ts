/* ─────────────────────────────────────────────
   CSRF token generation & validation
   ───────────────────────────────────────────── */

import { randomBytes, createHmac, timingSafeEqual } from "crypto";
import { CSRF_SECRET } from "./server-config";

const SECRET = CSRF_SECRET;

/**
 * Generate a CSRF token: timestamp.signature
 * Valid for `maxAgeMs` (default 1 hour).
 */
export function generateCsrfToken(): string {
  const nonce = randomBytes(16).toString("hex");
  const timestamp = Date.now().toString(36);
  const payload = `${nonce}.${timestamp}`;
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

/**
 * Validate a CSRF token.
 * Returns true if valid and not expired.
 */
export function validateCsrfToken(
  token: string,
  maxAgeMs = 60 * 60 * 1000,
): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [nonce, timestamp, sig] = parts;
  const payload = `${nonce}.${timestamp}`;

  // Verify signature (timing-safe)
  const expected = createHmac("sha256", SECRET).update(payload).digest("hex");
  if (sig.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(sig, "utf8"), Buffer.from(expected, "utf8")))
    return false;

  // Verify not expired
  const created = parseInt(timestamp, 36);
  if (isNaN(created)) return false;
  if (Date.now() - created > maxAgeMs) return false;

  return true;
}
