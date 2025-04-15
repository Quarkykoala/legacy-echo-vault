import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

/**
 * Creates a typed Supabase client instance.
 * Environment variables for URL and anon key must be provided by the consuming app.
 */
export function getSupabaseClient(supabaseUrl: string, supabaseAnonKey: string) {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export type { Database }; 