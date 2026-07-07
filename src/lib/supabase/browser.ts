import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Lazy browser-side Supabase client (anon key — safe to expose, RLS enforces access).
 * Called only from event handlers / effects, never during render, so prerendering
 * without env vars never crashes.
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      throw new Error("Supabase environment variables are not configured.");
    }
    client = createClient(url, anonKey);
  }
  return client;
}
