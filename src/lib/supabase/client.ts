import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set. Add it to your Netlify env vars.');
  return url;
}

function getAnonKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Add it to your Netlify env vars.');
  return key;
}

function getServiceKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_SERVICE_KEY is not set. Add it to your Netlify env vars.');
  return key;
}

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(getSupabaseUrl(), getAnonKey());
  }
  return supabaseInstance;
}

export function getSupabaseAdminClient(): SupabaseClient {
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(getSupabaseUrl(), getServiceKey());
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
