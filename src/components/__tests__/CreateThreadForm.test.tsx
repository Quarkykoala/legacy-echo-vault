import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateThreadForm } from '../CreateThreadForm';
import { threadService } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import { act } from 'react-dom/test-utils';
import { Thread } from '@/lib/types';

// --------------   MOCKS   --------------
jest.mock('@/services/api', () => {
  const createThread = jest.fn() as jest.MockedFunction<typeof threadService.createThread>;
  return { threadService: { createThread } };
});

jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

describe('CreateThreadForm', () => {
  const mockMemoryId = '123e4567-e89b-12d3-a456-426614174000';
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(<CreateThreadForm memoryId={mockMemoryId} onSuccess={mockOnSuccess} />);
    expect(screen.getByPlaceholderText('Write your thoughts...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Create Thread');
  });

  it('submits the form with valid data', async () => {
    const mockThread: Thread = {
      id: 'thread-1',
      content: 'Test thread content',
      memory_id: mockMemoryId,
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: null,
      parent_id: null,
      is_edited: false,
    };

    (threadService.createThread as jest.Mock).mockResolvedValueOnce(mockThread);

    render(<CreateThreadForm memoryId={mockMemoryId} onSuccess={mockOnSuccess} />);
    const textarea = screen.getByPlaceholderText('Write your thoughts...') as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button');

    // Fill in the form
    await userEvent.type(textarea, 'Test thread content');
    
    // Submit the form
    await act(async () => {
      await userEvent.click(submitButton);
    });

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(threadService.createThread).toHaveBeenCalledWith({
        memory_id: mockMemoryId,
        content: 'Test thread content',
        parent_id: null,
      });
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Thread created successfully',
      });
      expect(textarea.value).toBe(''); // Form should be reset
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('shows error toast when submission fails', async () => {
    const error = new Error('API Error');
    (threadService.createThread as jest.Mock).mockRejectedValueOnce(error);

    render(<CreateThreadForm memoryId={mockMemoryId} onSuccess={mockOnSuccess} />);
    const textarea = screen.getByPlaceholderText('Write your thoughts...') as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button');

    // Fill in the form
    await userEvent.type(textarea, 'Test thread content');
    
    // Submit the form
    await act(async () => {
      await userEvent.click(submitButton);
    });

    // Wait for the error state
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to create thread',
        variant: 'destructive',
      });
      expect(submitButton).toHaveTextContent('Create Thread');
      expect(submitButton).not.toBeDisabled();
      expect(textarea.value).toBe('Test thread content'); // Form should not be reset
    });
  });

  it('validates required fields', async () => {
    render(<CreateThreadForm memoryId={mockMemoryId} onSuccess={mockOnSuccess} />);
    const submitButton = screen.getByRole('button');

    // Submit empty form
    await act(async () => {
      await userEvent.click(submitButton);
    });

    // Should not call createThread
    expect(threadService.createThread).not.toHaveBeenCalled();
  });

  it('disables submit button while submitting', async () => {
    let resolvePromise: ((value: Thread) => void) | undefined;
    (threadService.createThread as jest.Mock).mockImplementationOnce(
      () => new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    render(<CreateThreadForm memoryId={mockMemoryId} onSuccess={mockOnSuccess} />);
    const textarea = screen.getByPlaceholderText('Write your thoughts...') as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button');

    // Fill in the form
    await userEvent.type(textarea, 'Test thread content');
    
    // Submit the form
    await act(async () => {
      await userEvent.click(submitButton);
    });

    // Check loading state
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Creating...');
      expect(textarea).toBeDisabled();
    });

    // Resolve the pending promise to complete the test
    await act(async () => {
      resolvePromise?.({
        id: 'thread-1',
        content: 'Test thread content',
        memory_id: mockMemoryId,
        created_by: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: null,
        parent_id: null,
        is_edited: false,
      });
    });

    // Check final state
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Create Thread');
      expect(textarea).not.toBeDisabled();
      expect(textarea.value).toBe(''); // Form should be reset
    });
  });
}); 