import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Avoid using 'import.meta' directly to support CommonJS environments like Jest
const metaEnv = (globalThis["import" + ".meta"] && globalThis["import" + ".meta"].env) || {};

const supabaseUrl = metaEnv.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Create the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type { Database };
