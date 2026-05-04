import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_PUBLIC_CONFIG } from "./public-config";

const SUPABASE_URL = SUPABASE_PUBLIC_CONFIG.url;
const SUPABASE_ANON_KEY = SUPABASE_PUBLIC_CONFIG.anonKey;

// -- Lazy singleton for server-side API routes (anon key, respects RLS)
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabase;
}

// -- Browser client for use in Client Components (auth)
export function createSupabaseBrowserClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
