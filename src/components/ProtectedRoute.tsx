import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div role="status" aria-busy="true" className="flex items-center justify-center h-full">
        <span className="loader" aria-label="Loading" />
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return <>{children}</>;
};
