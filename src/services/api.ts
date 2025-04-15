import { Database } from '@/lib/database.types';

type Vault = Database['public']['Tables']['vaults']['Row'];
type Memory = Database['public']['Tables']['memories']['Row'];
type Thread = Database['public']['Tables']['threads']['Row'];
type Member = Database['public']['Tables']['members']['Row'];

// Mock data
const mockVaults: Vault[] = [
  {
    id: 'vault-1',
    name: 'Family Memories',
    creator_id: 'mock-user-id',
    theme: ['sepia'],
    created_at: new Date().toISOString()
  },
  {
    id: 'vault-2',
    name: 'Travel Adventures',
    creator_id: 'mock-user-id',
    theme: ['modern'],
    created_at: new Date().toISOString()
  }
];

const mockMemories: Memory[] = [
  {
    id: 'memory-1',
    vault_id: 'vault-1',
    title: 'Summer BBQ 2023',
    story: 'Amazing family gathering with delicious food and great weather!',
    type: 'photo',
    created_by: 'mock-user-id',
    tags: ['family', 'summer'],
    unlock_date: null,
    created_at: new Date().toISOString()
  }
];

const mockThreads: Thread[] = [
  {
    id: 'thread-1',
    memory_id: 'memory-1',
    contributor_id: 'mock-user-id',
    text_note: 'What a wonderful day that was!',
    voice_note: null,
    photo: null,
    created_at: new Date().toISOString()
  }
];

// Vault APIs
export const getVaults = async (userId: string): Promise<Vault[]> => {
  return mockVaults.filter(vault => vault.creator_id === userId);
};

export const createVault = async (
  name: string, 
  creatorId: string, 
  theme: string[] = []
): Promise<Vault> => {
  const newVault: Vault = {
    id: `vault-${Date.now()}`,
    name,
    creator_id: creatorId,
    theme,
    created_at: new Date().toISOString()
  };
  mockVaults.push(newVault);
  return newVault;
};

// Memory APIs
export const getMemories = async (vaultId: string): Promise<Memory[]> => {
  return mockMemories.filter(memory => memory.vault_id === vaultId);
};

export const createMemory = async (
  memory: Omit<Memory, 'id' | 'created_at'>
): Promise<Memory> => {
  const newMemory: Memory = {
    ...memory,
    id: `memory-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  mockMemories.push(newMemory);
  return newMemory;
};

// Thread APIs
export const getThreads = async (memoryId: string): Promise<Thread[]> => {
  return mockThreads.filter(thread => thread.memory_id === memoryId);
};

export const addThread = async (
  thread: Omit<Thread, 'id' | 'created_at'>
): Promise<Thread> => {
  const newThread: Thread = {
    ...thread,
    id: `thread-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  mockThreads.push(newThread);
  return newThread;
};

// Storage APIs
export const uploadFile = async (
  bucket: string,
  filePath: string,
  file: File
): Promise<string> => {
  // Mock file upload - return a fake URL
  return `https://fake-storage.com/${bucket}/${filePath}`;
};

// User Profile
export const createUserProfile = async (
  userId: string,
  email: string,
  name: string,
): Promise<void> => {
  // Mock user creation
  console.log('Created user profile:', { userId, email, name });
};

export const getUserProfile = async (userId: string) => {
  // Mock user profile
  return {
    id: userId,
    name: 'Test User',
    email: 'test@example.com',
    bio: 'This is a test user',
    profile_image: null
  };
};

// Access control
export const getVaultRole = async (
  vaultId: string,
  userId: string
): Promise<'owner' | 'editor' | 'viewer' | null> => {
  // For testing, always return 'owner' for the mock user
  return userId === 'mock-user-id' ? 'owner' : null;
};
