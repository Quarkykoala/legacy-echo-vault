import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryView } from '../MemoryView';
import { Memory } from '@/lib/types';

// Mock child components
jest.mock('../VoiceMemoryPlayer', () => ({
  VoiceMemoryPlayer: () => <div data-testid="voice-player">Voice Player</div>,
}));

jest.mock('../ThreadList', () => ({
  ThreadList: () => <div data-testid="thread-list">Thread List</div>,
}));

jest.mock('../CreateThreadForm', () => ({
  CreateThreadForm: () => <div data-testid="create-thread-form">Create Thread Form</div>,
}));

describe('MemoryView', () => {
  const mockMemory: Memory = {
    id: 'memory-1',
    vault_id: 'vault-1',
    title: 'Test Memory',
    story: 'This is a test memory',
    type: 'text',
    media_url: null,
    created_by: 'user-1',
    tags: [],
    unlock_date: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
  };

  it('renders memory content correctly', async () => {
    render(<MemoryView memory={mockMemory} />);

    expect(screen.getByText('Test Memory')).toBeInTheDocument();
    expect(screen.getByText('This is a test memory')).toBeInTheDocument();
  });

  it('switches between memory content and threads tabs', async () => {
    render(<MemoryView memory={mockMemory} />);

    // Initially shows memory content
    const memoryContent = screen.getByText('This is a test memory');
    expect(memoryContent).toBeInTheDocument();
    expect(screen.queryByTestId('thread-list')).not.toBeInTheDocument();

    // Switch to threads tab
    const threadsTab = screen.getByRole('tab', { name: /threads/i });
    await userEvent.click(threadsTab);

    // Wait for content to update
    await waitFor(() => {
      const threadList = screen.getByTestId('thread-list');
      const createThreadForm = screen.getByTestId('create-thread-form');
      
      expect(threadList).toBeInTheDocument();
      expect(createThreadForm).toBeInTheDocument();
      expect(memoryContent).not.toBeInTheDocument();
    });

    // Switch back to memory tab
    const memoryTab = screen.getByRole('tab', { name: /memory/i });
    await userEvent.click(memoryTab);

    // Wait for content to update
    await waitFor(() => {
      expect(screen.getByText('This is a test memory')).toBeInTheDocument();
      expect(screen.queryByTestId('thread-list')).not.toBeInTheDocument();
    });
  });

  it('renders memory without optional content', async () => {
    const minimalMemory: Memory = {
      id: 'memory-1',
      vault_id: 'vault-1',
      title: 'Minimal Memory',
      story: '',
      type: 'text',
      media_url: null,
      created_by: 'user-1',
      tags: [],
      unlock_date: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: null,
    };

    render(<MemoryView memory={minimalMemory} />);

    expect(screen.getByText('Minimal Memory')).toBeInTheDocument();
    expect(screen.queryByTestId('voice-player')).not.toBeInTheDocument();
  });

  it('displays creation time correctly', async () => {
    render(<MemoryView memory={mockMemory} />);
    
    expect(screen.getByText(/Created/)).toBeInTheDocument();
  });
}); 