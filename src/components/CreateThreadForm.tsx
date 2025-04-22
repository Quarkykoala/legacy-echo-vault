import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createThreadSchema, CreateThreadInput } from '@/lib/types';
import { threadService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

interface CreateThreadFormProps {
  memoryId: string;
  onSuccess?: () => void;
}

export function CreateThreadForm({ memoryId, onSuccess }: CreateThreadFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<CreateThreadInput>({
    resolver: zodResolver(createThreadSchema),
    defaultValues: {
      memory_id: memoryId,
      content: '',
      parent_id: null,
    },
  });

  const onSubmit = async (data: CreateThreadInput) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await threadService.createThread({
        memory_id: memoryId,
        content: data.content,
        parent_id: null,
      });
      form.reset();
      toast({
        title: 'Success',
        description: 'Thread created successfully',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create thread',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Write your thoughts..."
                  className="min-h-[100px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Thread'}
        </Button>
      </form>
    </Form>
  );
} 