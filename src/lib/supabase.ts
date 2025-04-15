import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// These keys are safe to be in the client code - they have RLS enabled
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// You'll need to replace these values with your actual Supabase project details
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type { Database };
