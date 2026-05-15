import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set`);
  return val;
}

function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(requireEnv('NEXT_PUBLIC_SUPABASE_URL'), requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'));
  }
  return supabaseInstance;
}

function getSupabaseAdminClient(): SupabaseClient {
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(requireEnv('NEXT_PUBLIC_SUPABASE_URL'), requireEnv('NEXT_PUBLIC_SUPABASE_SERVICE_KEY'));
  }
  return supabaseAdminInstance;
}

export const supabase = new Proxy<SupabaseClient>({} as unknown as SupabaseClient, {
  get(_, prop) {
    return (getSupabaseClient() as any)[prop];
  },
});

export const supabaseAdmin = new Proxy<SupabaseClient>({} as unknown as SupabaseClient, {
  get(_, prop) {
    return (getSupabaseAdminClient() as any)[prop];
  },
});
