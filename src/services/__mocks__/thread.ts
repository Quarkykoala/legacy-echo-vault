import { Thread } from '@/types/thread';

export const createThread = jest.fn().mockImplementation(async (data: Partial<Thread>) => {
  if (!data.title) {
    throw new Error('Title is required');
  }
  return {
    id: 'mock-thread-id',
    title: data.title,
    content: data.content || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    memory_id: data.memory_id || 'mock-memory-id',
    created_by: 'mock-user-id'
  };
});

export const getThreads = jest.fn().mockResolvedValue([
  {
    id: 'mock-thread-1',
    title: 'Mock Thread 1',
    content: 'Mock content 1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    memory_id: 'mock-memory-id',
    created_by: 'mock-user-id'
  }
]);

export const getThread = jest.fn().mockImplementation(async (id: string) => {
  return {
    id,
    title: 'Mock Thread',
    content: 'Mock content',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    memory_id: 'mock-memory-id',
    created_by: 'mock-user-id'
  };
});

export const updateThread = jest.fn().mockImplementation(async (id: string, data: Partial<Thread>) => {
  return {
    id,
    ...data,
    updated_at: new Date().toISOString()
  };
});

export const deleteThread = jest.fn().mockResolvedValue(true); 