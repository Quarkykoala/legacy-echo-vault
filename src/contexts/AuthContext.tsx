import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Mock user for development
const mockUser: User = {
  id: 'mock-user-id',
  email: 'mock@example.com',
  role: 'authenticated',
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize with mock user for development
  const [user, setUser] = useState<User | null>(mockUser);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Skip authentication for development
  const signInWithEmail = async (email: string) => {
    setUser(mockUser);
  };

  const signOut = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signInWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
