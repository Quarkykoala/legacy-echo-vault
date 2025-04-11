
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// These keys are safe to be in the client code - they have RLS enabled
const supabaseUrl = 'https://supabase-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

// You'll need to replace these values with your actual Supabase project details
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type { Database };
