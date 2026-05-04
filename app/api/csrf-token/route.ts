import { NextResponse } from "next/server";
import { generateCsrfToken } from "@/lib/csrf";

// GET /api/csrf-token — Generate a CSRF token for forms
export async function GET() {
  const token = generateCsrfToken();
  return NextResponse.json({ token });
}
