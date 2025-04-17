interface Memory {
  id?: string;
  title: string;
  content: string;
  vaultId: string;
  userId: string;
  mediaUrl?: string;
  createdAt?: Date;
}

export const createMemory = async (memory: Memory): Promise<Memory> => {
  // This would normally call an API endpoint
  return { ...memory, id: 'mock-id', createdAt: new Date() };
};

export const uploadFile = async (file: File): Promise<string> => {
  // This would normally upload to storage
  return 'https://example.com/mock-url';
}; 