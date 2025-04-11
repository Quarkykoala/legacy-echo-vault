
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, FileAudio, FileText, Image } from 'lucide-react';
import { createMemory, uploadFile } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface CreateMemoryFormProps {
  vaultId: string;
  onMemoryCreated: () => void;
  onCancel: () => void;
}

export function CreateMemoryForm({ 
  vaultId, 
  onMemoryCreated, 
  onCancel 
}: CreateMemoryFormProps) {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [type, setType] = useState<'text' | 'audio' | 'photo'>('text');
  const [tags, setTags] = useState('');
  const [unlockDate, setUnlockDate] = useState<Date | undefined>(undefined);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication error',
        description: 'You must be signed in to create a memory',
        variant: 'destructive',
      });
      return;
    }

    if (!title.trim() || !story.trim()) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in title and story',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      let audioUrl = '';
      let photoUrl = '';

      // Handle file uploads if needed
      if (type === 'audio' && audioFile) {
        const fileName = `${vaultId}/${Date.now()}-${audioFile.name}`;
        audioUrl = await uploadFile('audio', fileName, audioFile);
      }

      if (type === 'photo' && photoFile) {
        const fileName = `${vaultId}/${Date.now()}-${photoFile.name}`;
        photoUrl = await uploadFile('photos', fileName, photoFile);
      }

      // Create the memory
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await createMemory({
        vault_id: vaultId,
        title,
        story: type === 'audio' 
          ? `${story}\n\n[Audio: ${audioUrl}]` 
          : type === 'photo'
          ? `${story}\n\n[Photo: ${photoUrl}]`
          : story,
        type,
        created_by: user.id,
        tags: tagsArray,
        unlock_date: unlockDate ? unlockDate.toISOString() : null
      });

      toast({
        title: 'Memory created',
        description: 'Your memory has been saved successfully',
      });

      onMemoryCreated();
    } catch (error) {
      console.error('Error creating memory:', error);
      toast({
        title: 'Failed to create memory',
        description: 'An error occurred while saving your memory',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-legacy-cream p-6 rounded-lg border border-legacy-sepia animate-scale-in">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-legacy-mahogany">Memory Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title of your memory"
          className="bg-white border-legacy-sepia"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="story" className="text-legacy-mahogany">Story</Label>
        <Textarea
          id="story"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Share your memory..."
          className="min-h-[150px] bg-white border-legacy-sepia"
          required
        />
      </div>

      <div className="space-y-2">
        <Label className="text-legacy-mahogany">Memory Type</Label>
        <RadioGroup 
          value={type} 
          onValueChange={(value) => setType(value as 'text' | 'audio' | 'photo')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="text" />
            <Label htmlFor="text" className="flex items-center">
              <FileText className="h-4 w-4 mr-1" /> Text
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="audio" id="audio" />
            <Label htmlFor="audio" className="flex items-center">
              <FileAudio className="h-4 w-4 mr-1" /> Audio
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="photo" id="photo" />
            <Label htmlFor="photo" className="flex items-center">
              <Image className="h-4 w-4 mr-1" /> Photo
            </Label>
          </div>
        </RadioGroup>
      </div>

      {type === 'audio' && (
        <div className="space-y-2">
          <Label htmlFor="audio-file" className="text-legacy-mahogany">Audio File</Label>
          <Input
            id="audio-file"
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            className="bg-white border-legacy-sepia"
          />
        </div>
      )}

      {type === 'photo' && (
        <div className="space-y-2">
          <Label htmlFor="photo-file" className="text-legacy-mahogany">Photo</Label>
          <Input
            id="photo-file"
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            className="bg-white border-legacy-sepia"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="tags" className="text-legacy-mahogany">Tags</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="family, reunion, grandparents (comma separated)"
          className="bg-white border-legacy-sepia"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-legacy-mahogany">Time Capsule (Optional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-white border-legacy-sepia",
                !unlockDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {unlockDate ? format(unlockDate, "PPP") : "Set an unlock date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="start">
            <Calendar
              mode="single"
              selected={unlockDate}
              onSelect={setUnlockDate}
              initialFocus
              disabled={(date) => date <= new Date()}
            />
          </PopoverContent>
        </Popover>
        <p className="text-xs text-legacy-ink/70">
          If set, this memory will be locked until the selected date
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="bg-white border-legacy-copper text-legacy-copper hover:bg-legacy-copper/10"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-legacy-copper hover:bg-legacy-mahogany"
        >
          {isLoading ? 'Creating...' : 'Save Memory'}
        </Button>
      </div>
    </form>
  );
}
