import { createServerClient } from "@supabase/ssr";
import { NextRequest } from "next/server";
import { SUPABASE_PUBLIC_CONFIG } from "./public-config";

export async function validateAdminRequest(request: NextRequest) {
  const supabase = createServerClient(
    SUPABASE_PUBLIC_CONFIG.url,
    SUPABASE_PUBLIC_CONFIG.anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // Read-only in API routes; cookies are not set here.
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
