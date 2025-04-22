import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input Component', () => {
  test('renders default input', () => {
    render(<Input placeholder="Default input" />);
    const input = screen.getByPlaceholderText('Default input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('border-input');
  });

  test('handles disabled state', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('cursor-not-allowed');
    expect(input).toHaveClass('opacity-50');
  });

  test('handles error state', () => {
    render(<Input error="Error message" placeholder="Error input" />);
    const input = screen.getByPlaceholderText('Error input');
    expect(input).toHaveClass('border-destructive');
    expect(input).toHaveClass('focus-visible:ring-destructive');
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  test('handles value changes', async () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} placeholder="Test input" />);
    const input = screen.getByPlaceholderText('Test input');
    await userEvent.type(input, 'test value');
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('test value');
  });

  test('applies custom className', () => {
    render(<Input className="custom-class" placeholder="Custom input" />);
    const input = screen.getByPlaceholderText('Custom input');
    expect(input).toHaveClass('custom-class');
  });

  test('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<Input ref={ref} placeholder="Ref input" />);
    expect(ref).toHaveBeenCalled();
  });

  test('handles different types', () => {
    render(<Input type="password" placeholder="Password input" />);
    const input = screen.getByPlaceholderText('Password input');
    expect(input).toHaveAttribute('type', 'password');
  });

  test('handles required attribute', () => {
    render(<Input required placeholder="Required input" />);
    const input = screen.getByPlaceholderText('Required input');
    expect(input).toBeRequired();
  });

  test('handles readonly attribute', () => {
    render(<Input readOnly placeholder="Readonly input" />);
    const input = screen.getByPlaceholderText('Readonly input');
    expect(input).toHaveAttribute('readonly');
  });

  test('handles maxLength attribute', () => {
    render(<Input maxLength={10} placeholder="MaxLength input" />);
    const input = screen.getByPlaceholderText('MaxLength input');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  test('handles focus and blur events', async () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    render(
      <Input
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Focus test input"
      />
    );
    const input = screen.getByPlaceholderText('Focus test input');
    await userEvent.click(input);
    expect(handleFocus).toHaveBeenCalled();
    await userEvent.tab();
    expect(handleBlur).toHaveBeenCalled();
  });
}); 