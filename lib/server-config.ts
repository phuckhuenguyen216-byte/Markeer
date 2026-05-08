import "server-only";

function normalizePrivateKey(value = "") {
  return value.replace(/\\n/g, "\n");
}

export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const GOOGLE_SHEETS_CONFIG = {
  sheetId: process.env.GOOGLE_SHEETS_ID || "",
  serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
  privateKey: normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY),
} as const;

export const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "";
export const CSRF_SECRET = process.env.CSRF_SECRET || ADMIN_API_KEY;
