import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SettingsScreen } from './SettingsScreen';

vi.mock('../../api/avatarService', () => ({
  prepareAvatarDataUrl: vi.fn(),
}));

describe('SettingsScreen', () => {
  const baseProps = {
    configs: [{ id: '1', name: 'Test', limit: 20, order: 0 }],
    user: { uid: 'u1', email: 'test@example.com', displayName: 'Test User' },
    settings: { accent: '#FF5F5F', widgetSize: 'MEDIUM', unitPrice: 0.5 },
    activeCounts: { '1': 2 },
    onAdd: vi.fn(),
    onReo: vi.fn(),
    onEditP: vi.fn(),
    onUpd: vi.fn(),
    onDel: vi.fn(),
  };

  it('renders identity and logging today badge', () => {
    render(
      <MemoryRouter>
        <SettingsScreen {...baseProps} />
      </MemoryRouter>
    );
    expect(screen.getByText('Identity')).toBeDefined();
    expect(screen.getByText('Logging today')).toBeDefined();
    expect(screen.getByText('Trackers')).toBeDefined();
  });

  it('shows no counts yet when counts are zero', () => {
    render(
      <MemoryRouter>
        <SettingsScreen {...baseProps} activeCounts={{ '1': 0 }} />
      </MemoryRouter>
    );
    expect(screen.getByText('No counts yet')).toBeDefined();
  });
});
