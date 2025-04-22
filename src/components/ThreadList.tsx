import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Thread } from '@/lib/types';
import { threadService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';

interface ThreadListProps {
  memoryId: string;
}

export function ThreadList({ memoryId }: ThreadListProps) {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [editingThread, setEditingThread] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadThreads();
    const unsubscribe = threadService.subscribeToThreads(memoryId, (updatedThreads) => {
      setThreads(updatedThreads);
    });

    return () => {
      unsubscribe();
    };
  }, [memoryId]);

  const loadThreads = async () => {
    try {
      const threads = await threadService.getThreadsByMemoryId(memoryId);
      setThreads(threads);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load threads',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (thread: Thread) => {
    setEditingThread(thread.id);
    setEditContent(thread.content);
  };

  const handleSaveEdit = async () => {
    if (!editingThread) return;
    
    setIsLoading(true);
    try {
      await threadService.updateThread(editingThread, { content: editContent });
      setEditingThread(null);
      setEditContent('');
      toast({
        title: 'Success',
        description: 'Thread updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update thread',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (threadId: string) => {
    setIsLoading(true);
    try {
      await threadService.deleteThread(threadId);
      setDeleteConfirm(null);
      toast({
        title: 'Success',
        description: 'Thread deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete thread',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <div
          key={thread.id}
          className="p-4 rounded-lg border border-gray-200 dark:border-gray-800"
        >
          {editingThread === thread.id ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleSaveEdit}
                  disabled={isLoading}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingThread(null)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-2">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                    {thread.is_edited && ' (edited)'}
                  </p>
                  <p className="text-sm font-medium">{thread.content}</p>
                </div>
                {user?.id === thread.created_by && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(thread)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(thread.id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ))}

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the thread.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={isLoading}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 