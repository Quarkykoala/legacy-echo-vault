import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button Component', () => {
  test('renders default button variant', () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole('button', { name: /default/i });
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-primary-foreground');
  });

  test('renders secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button', { name: /secondary/i });
    expect(button).toHaveClass('bg-secondary');
    expect(button).toHaveClass('text-secondary-foreground');
  });

  test('renders outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button', { name: /outline/i });
    expect(button).toHaveClass('border-2');
    expect(button).toHaveClass('border-input');
    expect(button).not.toBeDisabled();
  });

  test('renders ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button', { name: /ghost/i });
    expect(button).toHaveClass('bg-transparent');
    expect(button).toHaveClass('hover:bg-accent');
  });

  test('renders link variant', () => {
    render(<Button variant="link">Link</Button>);
    const button = screen.getByRole('button', { name: /link/i });
    expect(button).toHaveClass('text-primary');
    expect(button).toHaveClass('hover:underline');
  });

  test('renders destructive variant', () => {
    render(<Button variant="destructive">Destructive</Button>);
    const button = screen.getByRole('button', { name: /destructive/i });
    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('text-destructive-foreground');
  });

  test('handles disabled state correctly', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
    expect(button).toHaveClass('disabled:pointer-events-none');
  });

  test('handles loading state correctly', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.dataset.state).toBe('loading');
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('handles click events when not disabled', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not handle click events when disabled', async () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('applies custom className correctly', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button', { name: /custom/i });
    expect(button).toHaveClass('custom-class');
  });

  test('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole('button', { name: /small/i });
    expect(button).toHaveClass('h-9');

    rerender(<Button size="default">Default</Button>);
    button = screen.getByRole('button', { name: /default/i });
    expect(button).toHaveClass('h-10');

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button', { name: /large/i });
    expect(button).toHaveClass('h-11');
  });
}); 