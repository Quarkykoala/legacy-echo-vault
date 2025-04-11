
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { VaultGrid } from '@/components/VaultGrid';
import { CreateVaultDialog } from '@/components/CreateVaultDialog';
import { getVaults } from '@/services/api';
import { Database } from '@/lib/database.types';
import { useToast } from '@/components/ui/use-toast';

type Vault = Database['public']['Tables']['vaults']['Row'];

const Dashboard = () => {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const fetchVaults = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userVaults = await getVaults(user.id);
      setVaults(userVaults);
    } catch (error) {
      console.error('Error fetching vaults:', error);
      toast({
        title: 'Failed to load vaults',
        description: 'An error occurred while loading your vaults',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchVaults();
  }, [user]);
  
  const handleCreateVault = () => {
    setDialogOpen(true);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-serif text-legacy-mahogany mb-2">Your Memory Vaults</h1>
        <p className="text-legacy-ink/70">Create and manage your collection of memories</p>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-pulse bg-legacy-sepia/30 p-6 rounded-full">
            <svg className="h-10 w-10 text-legacy-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="mt-4 text-legacy-ink/70">Loading your vaults...</p>
        </div>
      ) : (
        <>
          {vaults.length === 0 ? (
            <div className="text-center py-12 bg-white/50 border border-legacy-sepia/30 rounded-lg max-w-xl mx-auto">
              <div className="inline-block bg-legacy-sepia/30 p-6 rounded-full">
                <svg className="h-12 w-12 text-legacy-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-serif text-legacy-mahogany">No vaults yet</h2>
              <p className="mt-2 text-legacy-ink/70 max-w-md mx-auto">
                Create your first vault to start preserving your precious memories and stories for generations to come.
              </p>
              <button
                onClick={handleCreateVault}
                className="mt-6 px-6 py-2 bg-legacy-copper text-white rounded-md hover:bg-legacy-mahogany transition-colors"
              >
                Create Your First Vault
              </button>
            </div>
          ) : (
            <VaultGrid vaults={vaults} onCreateVault={handleCreateVault} />
          )}
        </>
      )}
      
      <CreateVaultDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onVaultCreated={fetchVaults}
      />
    </div>
  );
};

export default Dashboard;
