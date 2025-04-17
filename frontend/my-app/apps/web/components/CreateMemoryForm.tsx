import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createMemory, uploadFile } from '@/services/api';

interface CreateMemoryFormProps {
  vaultId: string;
  onMemoryCreated: () => void;
  onCancel: () => void;
}

export function CreateMemoryForm({ vaultId, onMemoryCreated, onCancel }: CreateMemoryFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Required fields missing');
      return;
    }

    try {
      setIsSubmitting(true);
      let mediaUrl;
      
      if (file) {
        mediaUrl = await uploadFile(file);
      }

      await createMemory({
        title,
        content,
        vaultId,
        userId: user?.id || '',
        mediaUrl
      });

      setIsSubmitting(false);
      onMemoryCreated();
    } catch (error) {
      setIsSubmitting(false);
      setError('Failed to create memory');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div>{error}</div>}
      
      <div>
        <label htmlFor="title">Memory Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="story">Story</label>
        <textarea
          id="story"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="media">Add Media (optional)</label>
        <input
          id="media"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <div>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}>
          Save Memory
        </button>
      </div>
    </form>
  );
} 