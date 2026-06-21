import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthScreen } from './AuthScreen';

vi.mock('../../config/firebase', () => ({ auth: {} }));
vi.mock('../../api/authService', () => ({
  signInWithGoogle: vi.fn(),
  ensureUserDocument: vi.fn(),
}));

describe('AuthScreen', () => {
  it('renders sign in tab and form fields', () => {
    render(<AuthScreen />);
    expect(screen.getByRole('tab', { name: 'Sign in' })).toBeDefined();
    expect(screen.getByRole('tab', { name: 'Sign up' })).toBeDefined();
    expect(screen.getByLabelText('Email')).toBeDefined();
    expect(screen.getByLabelText('Password')).toBeDefined();
  });

  it('switches to sign up mode', () => {
    render(<AuthScreen />);
    fireEvent.click(screen.getByRole('tab', { name: 'Sign up' }));
    expect(screen.getByLabelText('Name')).toBeDefined();
  });

  it('shows validation error for empty email', () => {
    render(<AuthScreen />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Enter your email address.');
  });
});
