import { z } from 'zod';

// Zod Schemas
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(2),
  avatar_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const vaultSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  description: z.string().optional(),
  creator_id: z.string(),
  theme: z.array(z.enum(['sepia', 'midnight', 'pearl', 'dusk'])),
  created_at: z.string(),
  updated_at: z.string(),
});

export const memorySchema = z.object({
  id: z.string(),
  vault_id: z.string(),
  title: z.string().min(3),
  story: z.string(),
  type: z.enum(['text', 'photo', 'voice']),
  media_url: z.string().nullable(),
  created_by: z.string(),
  tags: z.array(z.string()),
  unlock_date: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const threadSchema = z.object({
  id: z.string().uuid(),
  memory_id: z.string().uuid(),
  created_by: z.string().uuid(),
  content: z.string().min(1).max(1000),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().nullable(),
  parent_id: z.string().uuid().nullable(),
  is_edited: z.boolean().default(false),
});

export const commentSchema = threadSchema.extend({
  thread_id: z.string().uuid(),
});

export const memberSchema = z.object({
  id: z.string(),
  vault_id: z.string(),
  user_id: z.string(),
  role: z.enum(['owner', 'editor', 'viewer']),
  created_at: z.string(),
  updated_at: z.string(),
});

// TypeScript Types
export type User = z.infer<typeof userSchema>;
export type Vault = z.infer<typeof vaultSchema>;
export type Memory = z.infer<typeof memorySchema>;
export type Thread = z.infer<typeof threadSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type Member = z.infer<typeof memberSchema>;

// API Response Types
export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

// Form Types
export type CreateVaultInput = Omit<Vault, 'id' | 'created_at' | 'updated_at'>;
export type CreateMemoryInput = Omit<Memory, 'id' | 'created_at' | 'updated_at'>;
export type CreateThreadInput = z.infer<typeof createThreadSchema>;
export type UpdateThreadInput = z.infer<typeof updateThreadSchema>;

export const createThreadSchema = threadSchema.pick({
  memory_id: true,
  content: true,
  parent_id: true,
});

export const updateThreadSchema = threadSchema.pick({
  content: true,
}); 