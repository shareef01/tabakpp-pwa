import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricBanner } from './MetricBanner';

describe('MetricBanner Component', () => {
  const mockMetrics = {
    limit: 20,
    count: 5,
    spentToday: 2.5,
    streak: 1,
    progress: 0.25,
  };

  it('renders all primary metrics', () => {
    render(<MetricBanner m={mockMetrics} />);
    expect(screen.getByText('Remaining')).toBeDefined();
    expect(screen.getByText('Spent Today')).toBeDefined();
    expect(screen.getByText('Days within limit')).toBeDefined();
    expect(screen.getByText('Daily quota')).toBeDefined();
  });

  it('shows remaining units', () => {
    render(<MetricBanner m={mockMetrics} />);
    expect(screen.getByText('15')).toBeDefined();
  });

  it('shows spent today in euros', () => {
    render(<MetricBanner m={mockMetrics} />);
    expect(screen.getByText('€')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
    expect(screen.getByText(',50')).toBeDefined();
  });

  it('shows streak with day label', () => {
    render(<MetricBanner m={mockMetrics} />);
    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('DAY')).toBeDefined();
  });

  it('shows over-limit daily quota progress', () => {
    render(<MetricBanner m={{ ...mockMetrics, count: 25, progress: 1.25 }} />);
    expect(screen.getByText('0')).toBeDefined();
    expect(screen.getByText(/125% over/)).toBeDefined();
  });
});
