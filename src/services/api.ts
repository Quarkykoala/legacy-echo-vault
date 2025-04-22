import { ApiResponse, CreateMemoryInput, CreateThreadInput, CreateVaultInput, Memory, Thread, User, Vault, UpdateThreadInput } from '@/lib/types';
import { supabase } from '@/lib/supabase';

// Helper function to handle API responses
const handleResponse = async <T>(
  promise: Promise<{ data: T | null; error: any }>
): Promise<ApiResponse<T>> => {
  try {
    const { data, error } = await promise;
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('API Error:', error);
    return { data: null, error: error.message };
  }
};

// User APIs
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  return handleResponse(supabase.auth.getUser());
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<User>
): Promise<ApiResponse<User>> => {
  return handleResponse(
    supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
  );
};

// Vault APIs
export const getVaults = async (userId: string): Promise<ApiResponse<Vault[]>> => {
  return handleResponse(
    supabase
      .from('vaults')
      .select('*, members!inner(*)')
      .eq('members.user_id', userId)
  );
};

export const createVault = async (
  input: CreateVaultInput
): Promise<ApiResponse<Vault>> => {
  return handleResponse(
    supabase
      .from('vaults')
      .insert([input])
      .select()
      .single()
  );
};

export const updateVault = async (
  vaultId: string,
  updates: Partial<Vault>
): Promise<ApiResponse<Vault>> => {
  return handleResponse(
    supabase
      .from('vaults')
      .update(updates)
      .eq('id', vaultId)
      .select()
      .single()
  );
};

export const deleteVault = async (
  vaultId: string
): Promise<ApiResponse<null>> => {
  return handleResponse(
    supabase
      .from('vaults')
      .delete()
      .eq('id', vaultId)
  );
};

// Memory APIs
export const getMemories = async (
  vaultId: string
): Promise<ApiResponse<Memory[]>> => {
  return handleResponse(
    supabase
      .from('memories')
      .select('*')
      .eq('vault_id', vaultId)
      .order('created_at', { ascending: false })
  );
};

export const createMemory = async (
  input: CreateMemoryInput
): Promise<ApiResponse<Memory>> => {
  return handleResponse(
    supabase
      .from('memories')
      .insert([input])
      .select()
      .single()
  );
};

export const updateMemory = async (
  memoryId: string,
  updates: Partial<Memory>
): Promise<ApiResponse<Memory>> => {
  return handleResponse(
    supabase
      .from('memories')
      .update(updates)
      .eq('id', memoryId)
      .select()
      .single()
  );
};

export const deleteMemory = async (
  memoryId: string
): Promise<ApiResponse<null>> => {
  return handleResponse(
    supabase
      .from('memories')
      .delete()
      .eq('id', memoryId)
  );
};

// Thread APIs
export const getThreads = async (
  memoryId: string
): Promise<ApiResponse<Thread[]>> => {
  return handleResponse(
    supabase
      .from('threads')
      .select('*')
      .eq('memory_id', memoryId)
      .order('created_at', { ascending: true })
  );
};

export const createThread = async (
  input: CreateThreadInput
): Promise<ApiResponse<Thread>> => {
  return handleResponse(
    supabase
      .from('threads')
      .insert([{ ...input, created_by: supabase.auth.user()?.id }])
      .select()
      .single()
  );
};

export const updateThread = async (
  threadId: string,
  updates: Partial<Thread>
): Promise<ApiResponse<Thread>> => {
  return handleResponse(
    supabase
      .from('threads')
      .update({ ...updates, is_edited: true, updated_at: new Date().toISOString() })
      .eq('id', threadId)
      .select()
      .single()
  );
};

export const deleteThread = async (
  threadId: string
): Promise<ApiResponse<null>> => {
  return handleResponse(
    supabase
      .from('threads')
      .delete()
      .eq('id', threadId)
  );
};

// Storage APIs
export const uploadFile = async (
  bucket: string,
  filePath: string,
  file: File
): Promise<ApiResponse<string>> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    return { data: null, error: error.message };
  }

  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { data: publicUrl.publicUrl, error: null };
};

// Access Control
export const getVaultRole = async (
  vaultId: string,
  userId: string
): Promise<ApiResponse<'owner' | 'editor' | 'viewer' | null>> => {
  const { data, error } = await supabase
    .from('members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', userId)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data.role, error: null };
};

export const threadService = {
  async createThread(input: CreateThreadInput): Promise<Thread> {
    try {
      const { data, error } = await supabase
        .from('threads')
        .insert([{ ...input, created_by: supabase.auth.user()?.id }])
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw error;
    }
  },

  async updateThread(id: string, input: UpdateThreadInput): Promise<Thread> {
    try {
      const { data, error } = await supabase
        .from('threads')
        .update({ ...input, is_edited: true, updated_at: new Date().toISOString() })
        .match({ id })
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating thread:', error);
      throw error;
    }
  },

  async deleteThread(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('threads')
        .delete()
        .match({ id });

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting thread:', error);
      throw error;
    }
  },

  async getThreadsByMemoryId(memoryId: string): Promise<Thread[]> {
    try {
      const { data, error } = await supabase
        .from('threads')
        .select('*')
        .eq('memory_id', memoryId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching threads:', error);
      throw error;
    }
  },

  async subscribeToThreads(memoryId: string, callback: (threads: Thread[]) => void): Promise<() => void> {
    const subscription = supabase
      .from(`threads:memory_id=eq.${memoryId}`)
      .on('*', async () => {
        const { data } = await supabase
          .from('threads')
          .select('*')
          .eq('memory_id', memoryId)
          .order('created_at', { ascending: true });
        
        if (data) callback(data);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
};
