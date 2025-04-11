
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Clock, Tag, User, Headphones, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { getThreads } from '@/services/api';
import { Database } from '@/lib/database.types';

type Memory = Database['public']['Tables']['memories']['Row'];
type Thread = Database['public']['Tables']['threads']['Row'];

const MemoryView = () => {
  const { memoryId } = useParams<{ memoryId: string }>();
  const [memory, setMemory] = useState<Memory | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchMemoryAndThreads = async () => {
    if (!memoryId) return;
    
    setLoading(true);
    try {
      // For this demo, we'll just use threads API
      // In a real app, you'd fetch the memory details first
      const threadsData = await getThreads(memoryId);
      setThreads(threadsData);
      
      // Mock memory data - in a real app, fetch this from API
      setMemory({
        id: memoryId,
        vault_id: 'vault-123',
        title: 'Grandma\'s Apple Pie Recipe',
        story: 'My grandmother passed down this special recipe that has been in our family for generations. She used to make it every fall when the apples were fresh from the orchard.',
        type: 'text',
        created_by: 'user-123',
        tags: ['recipe', 'family tradition', 'grandma'],
        unlock_date: null,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching memory:', error);
      toast({
        title: 'Failed to load memory',
        description: 'An error occurred while loading the memory details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemoryAndThreads();
  }, [memoryId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="inline-block animate-pulse bg-legacy-sepia/30 p-6 rounded-full">
            <svg className="h-10 w-10 text-legacy-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="mt-4 text-legacy-ink/70">Loading memory...</p>
        </div>
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-serif text-legacy-mahogany">Memory not found</h2>
          <p className="mt-2 text-legacy-ink/70">
            The memory you're looking for could not be found.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="mt-6 bg-legacy-copper hover:bg-legacy-mahogany"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getMemoryTypeIcon = () => {
    switch (memory.type) {
      case 'audio':
        return <Headphones className="h-5 w-5 text-legacy-copper" />;
      case 'photo':
        return <ImageIcon className="h-5 w-5 text-legacy-copper" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      <div className="max-w-3xl mx-auto">
        <div className="bg-legacy-parchment rounded-lg p-6 mb-8 shadow-md memory-card">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-serif text-legacy-mahogany">{memory.title}</h1>
            {getMemoryTypeIcon()}
          </div>
          
          <div className="prose max-w-none text-legacy-ink mb-6">
            <p>{memory.story}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {memory.tags && memory.tags.map((tag) => (
              <span 
                key={tag} 
                className="flex items-center text-sm bg-legacy-sepia/40 text-legacy-mahogany px-3 py-1 rounded-full"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex flex-wrap items-center text-sm text-legacy-ink/70 border-t border-legacy-sepia/30 pt-4">
            <div className="flex items-center mr-6 mb-2">
              <User className="h-4 w-4 mr-1" />
              <span>Created by {memory.created_by}</span>
            </div>
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {format(new Date(memory.created_at), 'MMMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/70 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-serif text-legacy-mahogany mb-4">Contributions</h2>
          
          {threads.length === 0 ? (
            <p className="text-legacy-ink/70 italic">
              No additional contributions yet.
            </p>
          ) : (
            <div className="space-y-6">
              {threads.map((thread) => (
                <div 
                  key={thread.id}
                  className="border-l-4 border-legacy-sepia pl-4 py-2"
                >
                  <div className="text-sm text-legacy-ink/70 mb-1">
                    {format(new Date(thread.created_at), 'MMMM d, yyyy')} by {thread.contributor_id}
                  </div>
                  {thread.text_note && (
                    <p className="text-legacy-ink">{thread.text_note}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryView;
