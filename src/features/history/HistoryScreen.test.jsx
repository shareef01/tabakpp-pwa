import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HistoryScreen } from './HistoryScreen';

describe('HistoryScreen', () => {
  it('renders empty state with add tracker CTA', () => {
    render(
      <HistoryScreen
        loading={false}
        logs={[]}
        configs={[]}
        m={{}}
        today="2026-06-20"
        onAddTracker={vi.fn()}
      />
    );
    expect(screen.getByText(/No history yet/i)).toBeDefined();
    expect(screen.getByText(/Add your first tracker/i)).toBeDefined();
  });

  it('shows chart summary for screen readers', () => {
    render(
      <HistoryScreen
        loading={false}
        logs={[{ id: '1', logDate: '2026-06-19', counts: { a: 3 } }]}
        configs={[{ id: 'a', name: 'Test', limit: 10 }]}
        m={{}}
        today="2026-06-20"
      />
    );
    expect(screen.getByText(/Daily usage over the last/i)).toBeDefined();
    expect(screen.getByRole('table', { name: /Daily usage trend/i })).toBeDefined();
  });
});
