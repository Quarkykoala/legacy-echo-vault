import { createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  // Add other user properties as needed
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  signInWithEmail?: (email: string, password: string) => Promise<void>;
  signOut?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Mock implementation for testing
  const value = {
    user: { id: 'test-user' },
    isLoading: false,
    signInWithEmail: async () => {},
    signOut: async () => {}
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 