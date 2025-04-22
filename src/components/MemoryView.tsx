import React from 'react';
import { Memory } from '@/lib/types';
import { VoiceMemoryPlayer } from './VoiceMemoryPlayer';
import { ThreadList } from './ThreadList';
import { CreateThreadForm } from './CreateThreadForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';

interface MemoryViewProps {
  memory: Memory;
}

export function MemoryView({ memory }: MemoryViewProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{memory.title}</CardTitle>
          <p className="text-sm text-gray-500">
            Created {formatDistanceToNow(new Date(memory.created_at), { addSuffix: true })}
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content" className="w-full">
            <TabsList>
              <TabsTrigger value="content">Memory</TabsTrigger>
              <TabsTrigger value="threads">Threads</TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <div className="space-y-4">
                {memory.story && (
                  <div className="prose dark:prose-invert">
                    <p>{memory.story}</p>
                  </div>
                )}
                {memory.type === 'voice' && memory.media_url && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Voice Note</h3>
                    <VoiceMemoryPlayer url={memory.media_url} />
                  </div>
                )}
                {memory.type === 'photo' && memory.media_url && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Photo</h3>
                    <img
                      src={memory.media_url}
                      alt="Memory"
                      className="rounded-lg max-w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="threads">
              <div className="space-y-6">
                <CreateThreadForm memoryId={memory.id} />
                <ThreadList memoryId={memory.id} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 