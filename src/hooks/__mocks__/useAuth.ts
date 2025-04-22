export const useAuth = jest.fn(() => ({
  user: {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
  },
  isLoading: false,
  error: null,
})); 