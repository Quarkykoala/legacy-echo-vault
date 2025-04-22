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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { VoiceMemoryRecorder } from './VoiceMemoryRecorder';
import { VoiceMemoryPlayer } from './VoiceMemoryPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CreateMemoryFormProps {
  vaultId: string;
  onMemoryCreated: () => void;
  onCancel: () => void;
}

// FileUploadSection component
interface FileUploadSectionProps {
  type: 'audio' | 'photo';
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  photoFile: File | null;
  setPhotoFile: (file: File | null) => void;
}

function FileUploadSection({ type, audioFile, setAudioFile, photoFile, setPhotoFile }: FileUploadSectionProps) {
  if (type === 'audio') {
    return (
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
    );
  }
  if (type === 'photo') {
    return (
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
    );
  }
  return null;
}

// UnlockDateSection component
interface UnlockDateSectionProps {
  unlockDate: Date | undefined;
  setUnlockDate: (date: Date | undefined) => void;
}

function UnlockDateSection({ unlockDate, setUnlockDate }: UnlockDateSectionProps) {
  return (
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
  );
}

const createMemoryFormSchema = z.object({
  vault_id: z.string(),
  title: z.string().min(1, 'Title is required'),
  story: z.string().min(1, 'Story is required'),
  type: z.enum(['text', 'audio', 'photo', 'voice']),
  created_by: z.string(),
  tags: z.array(z.string()),
  unlock_date: z.date().optional(),
  media_url: z.string().optional(),
});

type CreateMemoryFormData = z.infer<typeof createMemoryFormSchema>;

export function CreateMemoryForm({ 
  vaultId, 
  onMemoryCreated, 
  onCancel 
}: CreateMemoryFormProps) {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [type, setType] = useState<'text' | 'audio' | 'photo' | 'voice'>('text');
  const [tags, setTags] = useState('');
  const [unlockDate, setUnlockDate] = useState<Date | undefined>(undefined);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);

  const { toast } = useToast();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateMemoryFormData>({
    resolver: zodResolver(createMemoryFormSchema),
    defaultValues: {
      vault_id: vaultId,
      created_by: user?.id,
      type: 'text',
      tags: [],
    },
  });

  const handleSubmitForm = async (e: React.FormEvent) => {
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

      const data: CreateMemoryFormData = {
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
        unlock_date: unlockDate ? unlockDate.toISOString() : null,
        media_url: type === 'voice' ? voiceUrl : undefined
      };

      const response = await createMemory(data);
      
      if (response.error) {
        throw new Error(response.error);
      }

      toast.success('Memory created successfully');
      onMemoryCreated();
    } catch (error: any) {
      console.error('Error creating memory:', error);
      toast.error('Failed to create memory: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceRecordingComplete = (url: string) => {
    setVoiceUrl(url);
    toast.success('Voice recording saved');
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6 bg-legacy-cream p-6 rounded-lg border border-legacy-sepia animate-scale-in">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-legacy-mahogany">Memory Title</Label>
        <Input
          id="title"
          {...register('title')}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
          placeholder="Title of your memory"
          className="bg-white border-legacy-sepia"
          required
        />
        {errors.title && (
          <p id="title-error" className="text-sm text-red-500">
            {errors.title.message}
          </p>
        )}
      </div>

      <Tabs value={type} onValueChange={(v) => setType(v as 'text' | 'audio' | 'photo' | 'voice')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Text Memory</TabsTrigger>
          <TabsTrigger value="audio">Audio Memory</TabsTrigger>
          <TabsTrigger value="photo">Photo Memory</TabsTrigger>
          <TabsTrigger value="voice">Voice Memory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="story" className="text-legacy-mahogany">Story</Label>
            <Textarea
              id="story"
              {...register('story')}
              rows={5}
              aria-invalid={!!errors.story}
              aria-describedby={errors.story ? 'story-error' : undefined}
              placeholder="Share your memory..."
              className="min-h-[150px] bg-white border-legacy-sepia"
              required
            />
            {errors.story && (
              <p id="story-error" className="text-sm text-red-500">
                {errors.story.message}
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="audio">
          <FileUploadSection
            type="audio"
            audioFile={audioFile}
            setAudioFile={setAudioFile}
            photoFile={null}
            setPhotoFile={(file) => setAudioFile(file)}
          />
        </TabsContent>

        <TabsContent value="photo">
          <FileUploadSection
            type="photo"
            audioFile={null}
            setAudioFile={(file) => setAudioFile(file)}
            photoFile={photoFile}
            setPhotoFile={(file) => setPhotoFile(file)}
          />
        </TabsContent>

        <TabsContent value="voice">
          {!voiceUrl ? (
            <VoiceMemoryRecorder
              onRecordingComplete={handleVoiceRecordingComplete}
              maxDuration={300}
            />
          ) : (
            <div className="space-y-4">
              <VoiceMemoryPlayer
                url={voiceUrl}
                onError={() => {
                  toast.error('Failed to play recording');
                  setVoiceUrl(null);
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setVoiceUrl(null)}
              >
                Record Again
              </Button>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="story">Description (Optional)</Label>
            <Textarea
              id="story"
              {...register('story')}
              rows={3}
              placeholder="Add a description for your voice memory..."
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-2">
        <Label htmlFor="tags" className="text-legacy-mahogany">Tags</Label>
        <Input
          id="tags"
          {...register('tags')}
          placeholder="family, reunion, grandparents (comma separated)"
          className="bg-white border-legacy-sepia"
        />
      </div>

      <UnlockDateSection unlockDate={unlockDate} setUnlockDate={setUnlockDate} />

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
          disabled={isSubmitting || (type === 'voice' && !voiceUrl)}
          className="bg-legacy-copper hover:bg-legacy-mahogany"
        >
          {isSubmitting ? 'Creating...' : 'Save Memory'}
        </Button>
      </div>
    </form>
  );
}
