import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateMemoryForm } from './CreateMemoryForm';
import React from 'react';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user' }, isLoading: false })
}));
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() })
}));
jest.mock('@/services/api', () => ({
  createMemory: jest.fn(() => Promise.resolve()),
  uploadFile: jest.fn(() => Promise.resolve('mock-url')),
}));

describe('CreateMemoryForm', () => {
  it('renders and validates required fields', async () => {
    const onMemoryCreated = jest.fn();
    const onCancel = jest.fn();
    render(
      <CreateMemoryForm vaultId="vault-1" onMemoryCreated={onMemoryCreated} onCancel={onCancel} />
    );
    expect(screen.getByLabelText(/Memory Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Story/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Save Memory/i));
    await waitFor(() => {
      expect(screen.getByText(/Required fields missing/i)).toBeInTheDocument();
    });
  });

  it('submits form and calls onMemoryCreated', async () => {
    const onMemoryCreated = jest.fn();
    const onCancel = jest.fn();
    render(
      <CreateMemoryForm vaultId="vault-1" onMemoryCreated={onMemoryCreated} onCancel={onCancel} />
    );
    fireEvent.change(screen.getByLabelText(/Memory Title/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/Story/i), { target: { value: 'Test Story' } });
    fireEvent.click(screen.getByText(/Save Memory/i));
    await waitFor(() => {
      expect(onMemoryCreated).toHaveBeenCalled();
    });
  });
}); 