import { supabase } from '@/lib/supabase';

interface CreateThreadParams {
  memory_id: string;
  content: string;
  parent_id: string | null;
}

interface Thread {
  id: string;
  content: string;
  memory_id: string;
  parent_id?: string | null;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export const threadService = {
  async createThread({ memory_id, content, parent_id }: CreateThreadParams): Promise<Thread> {
    const { data, error } = await supabase
      .from('threads')
      .insert([
        {
          memory_id,
          content,
          parent_id,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
}; 