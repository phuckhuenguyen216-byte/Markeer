import "server-only";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLIC_CONFIG } from "./public-config";
import { SUPABASE_SERVICE_ROLE_KEY } from "./server-config";

let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      SUPABASE_PUBLIC_CONFIG.url,
      SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: { autoRefreshToken: false, persistSession: false },
      },
    );
  }
  return _supabaseAdmin;
}
