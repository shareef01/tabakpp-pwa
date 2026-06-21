import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders success message', () => {
    render(<Toast toast={{ message: 'Saved' }} onDismiss={vi.fn()} />);
    expect(screen.getByText('Saved')).toBeDefined();
  });

  it('renders error variant', () => {
    render(<Toast toast={{ message: 'Failed', variant: 'error' }} onDismiss={vi.fn()} />);
    expect(screen.getByText('Failed')).toBeDefined();
  });

  it('calls undo and dismiss', () => {
    const onDismiss = vi.fn();
    const onUndo = vi.fn();
    render(<Toast toast={{ message: '+1 Test', onUndo }} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByText('Undo'));
    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
