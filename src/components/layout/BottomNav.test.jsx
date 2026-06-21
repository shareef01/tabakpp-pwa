import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BottomNav } from './BottomNav';

describe('BottomNav', () => {
  it('marks active tab with aria-current', () => {
    render(
      <MemoryRouter>
        <BottomNav activeTab="track" onNavigate={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: 'Track' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Settings' })).not.toHaveAttribute('aria-current');
  });

  it('navigates via path on click', () => {
    const onNavigate = vi.fn();
    render(
      <MemoryRouter>
        <BottomNav activeTab="track" onNavigate={onNavigate} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: 'History' }));
    expect(onNavigate).toHaveBeenCalledWith('/history');
  });
});
