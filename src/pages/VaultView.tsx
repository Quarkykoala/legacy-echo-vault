
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { MemoryCard } from '@/components/MemoryCard';
import { CreateMemoryForm } from '@/components/CreateMemoryForm';
import { getMemories, getVaultRole } from '@/services/api';
import { Database } from '@/lib/database.types';
import { Plus, ArrowLeft, Filter } from 'lucide-react';

type Memory = Database['public']['Tables']['memories']['Row'];

const VaultView = () => {
  const { vaultId } = useParams<{ vaultId: string }>();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userRole, setUserRole] = useState<'owner' | 'editor' | 'viewer' | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchMemories = async () => {
    if (!vaultId) return;
    
    setLoading(true);
    try {
      const memoriesData = await getMemories(vaultId);
      setMemories(memoriesData);
      
      if (user) {
        const role = await getVaultRole(vaultId, user.id);
        setUserRole(role);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
      toast({
        title: 'Failed to load memories',
        description: 'An error occurred while loading the vault memories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [vaultId, user]);

  const handleMemoryClick = (memoryId: string) => {
    navigate(`/memory/${memoryId}`);
  };

  const canCreateMemory = userRole === 'owner' || userRole === 'editor';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h1 className="text-3xl font-serif text-legacy-mahogany">{memories[0]?.vault_id || 'Vault'}</h1>
      </div>

      {!showCreateForm && (
        <div className="flex justify-between items-center mb-6">
          <p className="text-legacy-ink/70">
            {memories.length} {memories.length === 1 ? 'memory' : 'memories'} in this vault
          </p>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            {canCreateMemory && (
              <Button 
                className="bg-legacy-copper hover:bg-legacy-mahogany flex items-center"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Memory
              </Button>
            )}
          </div>
        </div>
      )}

      {showCreateForm ? (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif text-legacy-mahogany mb-6">Create New Memory</h2>
          <CreateMemoryForm
            vaultId={vaultId!}
            onMemoryCreated={() => {
              setShowCreateForm(false);
              fetchMemories();
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      ) : (
        <>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-pulse bg-legacy-sepia/30 p-6 rounded-full">
                <svg className="h-10 w-10 text-legacy-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="mt-4 text-legacy-ink/70">Loading memories...</p>
            </div>
          ) : (
            <>
              {memories.length === 0 ? (
                <div className="text-center py-12 bg-white/50 border border-legacy-sepia/30 rounded-lg max-w-xl mx-auto">
                  <div className="inline-block bg-legacy-sepia/30 p-6 rounded-full">
                    <svg className="h-12 w-12 text-legacy-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="mt-4 text-xl font-serif text-legacy-mahogany">No memories yet</h2>
                  <p className="mt-2 text-legacy-ink/70 max-w-md mx-auto">
                    {canCreateMemory 
                      ? "Start by adding your first memory to this vault."
                      : "There are no memories in this vault yet. Please check back later."}
                  </p>
                  {canCreateMemory && (
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="mt-6 px-6 py-2 bg-legacy-copper text-white rounded-md hover:bg-legacy-mahogany transition-colors"
                    >
                      Create Your First Memory
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {memories.map((memory) => (
                    <MemoryCard
                      key={memory.id}
                      memory={memory}
                      onClick={handleMemoryClick}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default VaultView;
