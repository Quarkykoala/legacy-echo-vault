import { ApiResponse, CreateMemoryInput, CreateThreadInput, CreateVaultInput, Memory, Thread, User, Vault, UpdateThreadInput } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { User as AuthUser } from '@supabase/supabase-js';
import { PostgrestBuilder } from '@supabase/postgrest-js';

// Helper function to handle API responses
const handleResponse = async <T>(
  action: PostgrestBuilder<T> | Promise<{ data: T | null; error: any }>
): Promise<ApiResponse<T>> => {
  try {
    const { data, error } = await action;
    if (error) throw error;
    return { data, error: null };
  } catch (error: unknown) {
    console.error('API Error:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
};

// User APIs
export const getCurrentUser = async (): Promise<ApiResponse<AuthUser>> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return { data: null, error: error.message };
  if (!user) return { data: null, error: 'No user found' };
  return { data: user, error: null };
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<User>
): Promise<ApiResponse<User>> => {
  const response = supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return handleResponse(response);
};

// Vault APIs
export const getVaults = async (userId: string): Promise<ApiResponse<Vault[]>> => {
  const response = supabase
    .from('vaults')
    .select('*, members!inner(*)')
    .eq('members.user_id', userId);
  return handleResponse(response);
};

export const createVault = async (
  input: CreateVaultInput
): Promise<ApiResponse<Vault>> => {
  const response = supabase
    .from('vaults')
    .insert([input])
    .select()
    .single();
  return handleResponse(response);
};

export const updateVault = async (
  vaultId: string,
  updates: Partial<Vault>
): Promise<ApiResponse<Vault>> => {
  const response = supabase
    .from('vaults')
    .update(updates)
    .eq('id', vaultId)
    .select()
    .single();
  return handleResponse(response);
};

export const deleteVault = async (
  vaultId: string
): Promise<ApiResponse<null>> => {
  const response = supabase
    .from('vaults')
    .delete()
    .eq('id', vaultId);
  return handleResponse(response);
};

// Memory APIs
export const getMemories = async (
  vaultId: string
): Promise<ApiResponse<Memory[]>> => {
  const response = supabase
    .from('memories')
    .select('*')
    .eq('vault_id', vaultId)
    .order('created_at', { ascending: false });
  return handleResponse(response);
};

export const createMemory = async (
  input: CreateMemoryInput
): Promise<ApiResponse<Memory>> => {
  const response = supabase
    .from('memories')
    .insert([input])
    .select()
    .single();
  return handleResponse(response);
};

export const updateMemory = async (
  memoryId: string,
  updates: Partial<Memory>
): Promise<ApiResponse<Memory>> => {
  const response = supabase
    .from('memories')
    .update(updates)
    .eq('id', memoryId)
    .select()
    .single();
  return handleResponse(response);
};

export const deleteMemory = async (
  memoryId: string
): Promise<ApiResponse<null>> => {
  const response = supabase
    .from('memories')
    .delete()
    .eq('id', memoryId);
  return handleResponse(response);
};

// Thread APIs
export const getThreads = async (
  memoryId: string
): Promise<ApiResponse<Thread[]>> => {
  const response = supabase
    .from('threads')
    .select('*')
    .eq('memory_id', memoryId)
    .order('created_at', { ascending: true });
  return handleResponse(response);
};

export const createThread = async (
  input: CreateThreadInput
): Promise<ApiResponse<Thread>> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'User not authenticated' };

  const response = supabase
    .from('threads')
    .insert([{ ...input, created_by: user.id }])
    .select()
    .single();
  return handleResponse(response);
};

export const updateThread = async (
  threadId: string,
  updates: Partial<Thread>
): Promise<ApiResponse<Thread>> => {
  const response = supabase
    .from('threads')
    .update({ ...updates, is_edited: true, updated_at: new Date().toISOString() })
    .eq('id', threadId)
    .select()
    .single();
  return handleResponse(response);
};

export const deleteThread = async (
  threadId: string
): Promise<ApiResponse<null>> => {
  const response = supabase
    .from('threads')
    .delete()
    .eq('id', threadId);
  return handleResponse(response);
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
export type VaultRole = 'owner' | 'editor' | 'viewer';

export const getVaultRole = async (
  vaultId: string,
  userId: string
): Promise<ApiResponse<VaultRole | null>> => {
  const query = supabase
    .from('members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', userId)
    .single();

  const response = await handleResponse<{ role: VaultRole }>(query);
  return { data: response.data ? response.data.role : null, error: response.error };
};

// Improved thread service with proper typing and modern auth
export const threadService = {
  async createThread(input: CreateThreadInput): Promise<Thread> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const response = await handleResponse(
      supabase
        .from('threads')
        .insert([{ ...input, created_by: user.id }])
        .select()
        .single()
    );

    if (!response.data) throw new Error(response.error || 'Failed to create thread');
    return response.data;
  },

  async updateThread(id: string, input: UpdateThreadInput): Promise<Thread> {
    const response = await handleResponse(
      supabase
        .from('threads')
        .update({ ...input, is_edited: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
    );

    if (!response.data) throw new Error(response.error || 'Failed to update thread');
    return response.data;
  },

  async deleteThread(id: string): Promise<void> {
    const response = await handleResponse(
      supabase
        .from('threads')
        .delete()
        .eq('id', id)
    );

    if (response.error) throw new Error(response.error);
  },

  async getThreadsByMemoryId(memoryId: string): Promise<Thread[]> {
    const response = await handleResponse(
      supabase
        .from('threads')
        .select('*')
        .eq('memory_id', memoryId)
        .order('created_at', { ascending: true })
    );

    if (!response.data) throw new Error(response.error || 'Failed to fetch threads');
    return response.data;
  },

  async subscribeToThreads(
    memoryId: string,
    callback: (threads: Thread[]) => void
  ): Promise<() => void> {
    const channel = supabase
      .channel('threads')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'threads',
          filter: `memory_id=eq.${memoryId}`,
        },
        async () => {
          const response = await handleResponse(
            supabase
              .from('threads')
              .select('*')
              .eq('memory_id', memoryId)
              .order('created_at', { ascending: true })
          );
          if (response.data) callback(response.data);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }
};

export const vaultService = {
  async getUserVaultRole(vaultId: string): Promise<VaultRole | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('vault_members')
      .select('role')
      .eq('vault_id', vaultId)
      .eq('user_id', user.id)
      .single();

    if (error || !data) return null;
    return data.role as VaultRole;
  },
};
