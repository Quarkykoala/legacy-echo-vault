
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database } from '@/lib/database.types';
import { FileAudio, FileText, Image } from 'lucide-react';

type Memory = Database['public']['Tables']['memories']['Row'];

interface MemoryCardProps {
  memory: Memory;
  onClick: (memoryId: string) => void;
}

export function MemoryCard({ memory, onClick }: MemoryCardProps) {
  const memoryDate = new Date(memory.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isLocked = memory.unlock_date && new Date(memory.unlock_date) > new Date();

  const getMemoryTypeIcon = () => {
    switch (memory.type) {
      case 'audio':
        return <FileAudio className="h-5 w-5 text-legacy-copper" />;
      case 'photo':
        return <Image className="h-5 w-5 text-legacy-copper" />;
      case 'text':
      default:
        return <FileText className="h-5 w-5 text-legacy-copper" />;
    }
  };
  
  return (
    <Card 
      className={`memory-card hover:shadow-lg transition-all duration-300 h-full ${
        isLocked ? 'bg-legacy-sepia/30' : 'bg-legacy-parchment'
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-serif text-legacy-mahogany">{memory.title}</CardTitle>
          <div className="p-1 bg-white/80 rounded-full">
            {getMemoryTypeIcon()}
          </div>
        </div>
        <CardDescription className="text-legacy-ink/70">
          {memoryDate}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLocked ? (
          <div className="flex flex-col items-center p-4">
            <div className="bg-legacy-sepia/50 p-4 rounded-full mb-2">
              <svg className="h-8 w-8 text-legacy-mahogany" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-center text-legacy-mahogany font-medium">This memory is locked</p>
            <p className="text-sm text-legacy-ink/70 text-center mt-1">
              Unlocks on {new Date(memory.unlock_date!).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p className="text-legacy-ink line-clamp-3">{memory.story}</p>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-legacy-sepia/30 bg-white/20">
        <Button 
          variant="outline" 
          className="text-xs bg-white/70 border-legacy-copper text-legacy-copper hover:bg-legacy-copper hover:text-white"
          onClick={() => onClick(memory.id)}
          disabled={isLocked}
        >
          {isLocked ? 'Locked' : 'View Memory'}
        </Button>
        {memory.tags && memory.tags.length > 0 && (
          <div className="ml-auto flex gap-1">
            {memory.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs bg-legacy-sepia/40 text-legacy-mahogany px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
            {memory.tags.length > 2 && (
              <span className="text-xs bg-legacy-sepia/40 text-legacy-mahogany px-2 py-1 rounded-full">
                +{memory.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
