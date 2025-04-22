import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryView } from '../MemoryView';
import { Memory } from '@/lib/types';

// Mock child components to isolate MemoryView tests
jest.mock('../VoiceMemoryPlayer', () => ({
  VoiceMemoryPlayer: () => <div data-testid="voice-player">Voice Player</div>,
}));

jest.mock('../ThreadList', () => ({
  ThreadList: () => <div data-testid="thread-list">Thread List</div>,
}));

jest.mock('../CreateThreadForm', () => ({
  CreateThreadForm: () => <div data-testid="create-thread-form">Create Thread Form</div>,
}));

describe('MemoryView Optional Props', () => {
  const baseMemory: Memory = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    vault_id: '123e4567-e89b-12d3-a456-426614174001',
    title: 'Test Memory',
    story: '',
    type: 'text',
    media_url: null,
    created_by: 'user-1',
    tags: [],
    unlock_date: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
  };

  test('renders memory with story when provided', () => {
    const memoryWithStory = {
      ...baseMemory,
      story: 'This is a test story.',
    };
    render(<MemoryView memory={memoryWithStory} />);
    expect(screen.getByText('Test Memory')).toBeInTheDocument();
    expect(screen.getByText('This is a test story.')).toBeInTheDocument();
  });

  test('does not render story block when story is empty', () => {
    render(<MemoryView memory={baseMemory} />);
    expect(screen.getByText('Test Memory')).toBeInTheDocument();
    expect(screen.queryByText('This is a test story.')).not.toBeInTheDocument();
  });

  test('renders voice memory player when type is voice and media_url provided', () => {
    const voiceMemory = {
      ...baseMemory,
      type: 'voice' as const,
      media_url: 'https://example.com/audio.mp3',
      story: 'Voice memory description',
    };
    render(<MemoryView memory={voiceMemory} />);
    expect(screen.getByTestId('voice-player')).toBeInTheDocument();
  });

  test('does not render voice memory player when media_url is missing', () => {
    const voiceMemoryNoUrl = {
      ...baseMemory,
      type: 'voice' as const,
      story: 'Voice memory without URL',
    };
    render(<MemoryView memory={voiceMemoryNoUrl} />);
    expect(screen.queryByTestId('voice-player')).not.toBeInTheDocument();
  });

  test('renders photo memory image when type is photo and media_url provided', () => {
    const photoMemory = {
      ...baseMemory,
      type: 'photo' as const,
      media_url: 'https://example.com/photo.jpg',
      story: 'Photo memory description',
    };
    render(<MemoryView memory={photoMemory} />);
    const image = screen.getByRole('img', { name: /memory/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  test('does not render photo memory image when media_url is missing', () => {
    const photoMemoryNoUrl = {
      ...baseMemory,
      type: 'photo' as const,
      story: 'Photo memory without URL',
    };
    render(<MemoryView memory={photoMemoryNoUrl} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('switches between memory content and threads tabs', async () => {
    render(<MemoryView memory={baseMemory} />);
    
    // Initially shows memory content
    expect(screen.getByText('Test Memory')).toBeInTheDocument();
    expect(screen.queryByTestId('thread-list')).not.toBeInTheDocument();

    // Switch to threads tab
    const threadsTab = screen.getByRole('tab', { name: /threads/i });
    await userEvent.click(threadsTab);

    // Wait for content to update
    await waitFor(() => {
      expect(screen.getByTestId('thread-list')).toBeInTheDocument();
      expect(screen.getByTestId('create-thread-form')).toBeInTheDocument();
    });

    // Switch back to memory tab
    const memoryTab = screen.getByRole('tab', { name: /memory/i });
    await userEvent.click(memoryTab);

    // Wait for content to update
    await waitFor(() => {
      expect(screen.getByText('Test Memory')).toBeInTheDocument();
      expect(screen.queryByTestId('thread-list')).not.toBeInTheDocument();
    });
  });
}); 