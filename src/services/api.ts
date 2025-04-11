
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type Vault = Database['public']['Tables']['vaults']['Row'];
type Memory = Database['public']['Tables']['memories']['Row'];
type Thread = Database['public']['Tables']['threads']['Row'];
type Member = Database['public']['Tables']['members']['Row'];

// Vault APIs
export const getVaults = async (userId: string): Promise<Vault[]> => {
  const { data, error } = await supabase
    .from('members')
    .select('vault_id')
    .eq('user_id', userId);

  if (error) throw error;

  if (data.length === 0) return [];

  const vaultIds = data.map(member => member.vault_id);

  const { data: vaults, error: vaultError } = await supabase
    .from('vaults')
    .select('*')
    .in('id', vaultIds);

  if (vaultError) throw vaultError;

  return vaults || [];
};

export const createVault = async (
  name: string, 
  creatorId: string, 
  theme: string[] = []
): Promise<Vault> => {
  const { data, error } = await supabase
    .from('vaults')
    .insert({ name, creator_id: creatorId, theme })
    .select()
    .single();

  if (error) throw error;

  // Add creator as owner
  const { error: memberError } = await supabase
    .from('members')
    .insert({
      vault_id: data.id,
      user_id: creatorId,
      role: 'owner'
    });

  if (memberError) throw memberError;

  return data;
};

// Memory APIs
export const getMemories = async (vaultId: string): Promise<Memory[]> => {
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .eq('vault_id', vaultId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createMemory = async (
  memory: Omit<Memory, 'id' | 'created_at'>
): Promise<Memory> => {
  const { data, error } = await supabase
    .from('memories')
    .insert(memory)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Thread APIs
export const getThreads = async (memoryId: string): Promise<Thread[]> => {
  const { data, error } = await supabase
    .from('threads')
    .select('*')
    .eq('memory_id', memoryId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const addThread = async (
  thread: Omit<Thread, 'id' | 'created_at'>
): Promise<Thread> => {
  const { data, error } = await supabase
    .from('threads')
    .insert(thread)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Storage APIs
export const uploadFile = async (
  bucket: string,
  filePath: string,
  file: File
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};

// User Profile
export const createUserProfile = async (
  userId: string,
  email: string,
  name: string,
): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .insert({
      id: userId, 
      email,
      name
    });

  if (error) throw error;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

// Access control
export const getVaultRole = async (
  vaultId: string,
  userId: string
): Promise<'owner' | 'editor' | 'viewer' | null> => {
  const { data, error } = await supabase
    .from('members')
    .select('role')
    .eq('vault_id', vaultId)
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data?.role || null;
};
