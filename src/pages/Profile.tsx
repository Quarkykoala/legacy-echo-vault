import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@/services/api';
import { ProfileForm } from '@/components/ProfileForm';
import { User } from '@/lib/types';
import { toast } from 'sonner';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        
        if (response.error) {
          throw new Error(response.error);
        }

        if (!response.data) {
          navigate('/auth');
          return;
        }

        setUser(response.data);
      } catch (error: any) {
        toast.error('Failed to load profile: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center space-x-4 mb-6">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-2xl font-medium text-gray-600 dark:text-gray-400">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>

          <ProfileForm
            user={user}
            onSuccess={() => {
              // Refresh user data after successful update
              getCurrentUser().then((response) => {
                if (response.data) {
                  setUser(response.data);
                }
              });
            }}
          />
        </div>
      </div>
    </div>
  );
} 