import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThreadList } from '../ThreadList';
import { threadService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Thread } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

// Mock the dependencies
jest.mock('@/services/api', () => ({
  threadService: {
    getThreadsByMemoryId: jest.fn(),
    updateThread: jest.fn(),
    deleteThread: jest.fn(),
    subscribeToThreads: jest.fn(() => () => {}),
  },
}));

jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

// Use the mock from __mocks__/useAuth.ts
jest.mock('@/hooks/useAuth');

const mockThreads: Thread[] = [
  {
    id: '1',
    memory_id: 'memory-1',
    created_by: 'user-1',
    content: 'Test thread 1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
    parent_id: null,
    is_edited: false,
  },
  {
    id: '2',
    memory_id: 'memory-1',
    created_by: 'user-2',
    content: 'Test thread 2',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: null,
    parent_id: null,
    is_edited: false,
  },
];

describe('ThreadList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (threadService.getThreadsByMemoryId as jest.Mock).mockResolvedValue(mockThreads);
  });

  it('renders threads correctly', async () => {
    render(<ThreadList memoryId="memory-1" />);

    await waitFor(() => {
      expect(screen.getByText('Test thread 1')).toBeInTheDocument();
      expect(screen.getByText('Test thread 2')).toBeInTheDocument();
    });
  });

  it('shows edit and delete buttons only for user\'s own threads', async () => {
    render(<ThreadList memoryId="memory-1" />);

    await waitFor(() => {
      // User's own thread should have edit and delete buttons
      const thread1Buttons = screen.getAllByRole('button', { name: /edit|delete/i });
      expect(thread1Buttons).toHaveLength(2);

      // Other user's thread should not have edit and delete buttons
      const thread2 = screen.getByText('Test thread 2').closest('div');
      const thread2Buttons = thread2?.querySelectorAll('button');
      expect(thread2Buttons?.length).toBe(0);
    });
  });

  it('handles thread editing correctly', async () => {
    const updatedThread = { ...mockThreads[0], content: 'Updated content' };
    (threadService.updateThread as jest.Mock).mockResolvedValueOnce(updatedThread);

    render(<ThreadList memoryId="memory-1" />);

    await waitFor(() => {
      expect(screen.getByText('Test thread 1')).toBeInTheDocument();
    });

    // Click edit button
    const editButton = screen.getByRole('button', { name: /edit/i });
    await userEvent.click(editButton);

    // Edit the content
    const textarea = screen.getByRole('textbox');
    await userEvent.clear(textarea);
    await userEvent.type(textarea, 'Updated content');

    // Save the edit
    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(threadService.updateThread).toHaveBeenCalledWith('1', {
        content: 'Updated content',
      });
      expect(toast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Thread updated successfully',
      });
    });
  });

  it('handles thread deletion correctly', async () => {
    (threadService.deleteThread as jest.Mock).mockResolvedValueOnce(undefined);

    render(<ThreadList memoryId="memory-1" />);

    await waitFor(() => {
      expect(screen.getByText('Test thread 1')).toBeInTheDocument();
    });

    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    // Confirm deletion in the alert dialog
    const confirmButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(threadService.deleteThread).toHaveBeenCalledWith('1');
      expect(toast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Thread deleted successfully',
      });
    });
  });

  it('shows error toast when thread loading fails', async () => {
    const error = new Error('Failed to load threads');
    (threadService.getThreadsByMemoryId as jest.Mock).mockRejectedValue(error);

    render(<ThreadList memoryId="memory-1" />);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to load threads',
        variant: 'destructive',
      });
    });
  });
}); 