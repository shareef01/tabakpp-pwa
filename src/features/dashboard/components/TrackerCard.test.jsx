import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TrackerCard } from './TrackerCard';

describe('TrackerCard Component', () => {
  const mockConfig = {
    id: 'blend-1',
    name: 'Vanelle Blue',
    limit: 10,
    type: 'CIGARETTE'
  };

  const setup = (props = {}) => {
    const onInc = vi.fn();
    const onDec = vi.fn();
    const defaultProps = {
      config: mockConfig,
      count: 5,
      onInc,
      onDec,
      index: 0,
      globalSize: 'MEDIUM'
    };
    return {
      ...render(<TrackerCard {...defaultProps} {...props} />),
      onInc,
      onDec
    };
  };

  it('renders correct blend name and count', () => {
    setup();
    expect(screen.getByTestId('blend-name')).toHaveTextContent('Vanelle Blue');
    expect(screen.getByTestId('counter-value')).toHaveTextContent('5');
    expect(screen.getByText('10Q')).toBeDefined();
  });

  it('fires increment on plus click', () => {
    const { onInc } = setup();
    fireEvent.click(screen.getByLabelText('Increase Vanelle Blue'));
    expect(onInc).toHaveBeenCalledTimes(1);
  });

  it('fires decrement on minus click', () => {
    const { onDec } = setup();
    fireEvent.click(screen.getByLabelText('Decrease Vanelle Blue'));
    expect(onDec).toHaveBeenCalledTimes(1);
  });

  it('applies limit reached styling when count >= limit', () => {
    setup({ count: 10 });
    const card = screen.getByTestId('tracker-card-0');
    expect(card.className).toContain('border-rose-500');
  });

  it('applies LARGE widget size marker', () => {
    setup({ globalSize: 'LARGE' });
    const card = screen.getByTestId('tracker-card-0');
    expect(card.getAttribute('data-widget-size')).toBe('LARGE');
    expect(card.className).toContain('tracker-card');
  });
});
