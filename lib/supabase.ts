import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = "https://jfxnhcmxsplikldmjnvi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_P6z5rGTLqJ-YU_bWg9J2Zw_x8K41MbX";
const SUPABASE_SERVICE_ROLE_KEY = "sb_secret_bHhYvSy29fxHKi_oXmlt6A_sr1RbX1d";

// -- Lazy singleton for server-side API routes (anon key, respects RLS)
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabase;
}

// -- Admin client - service_role key, bypasses RLS
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _supabaseAdmin;
}

// -- Browser client for use in Client Components (auth)
export function createSupabaseBrowserClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
