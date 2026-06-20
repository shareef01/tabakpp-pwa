import { describe, it, expect, vi } from 'vitest';

import { render, screen, fireEvent } from '@testing-library/react';

import { Header } from './Header';



describe('Header Component', () => {

  const mockUser = {

    displayName: 'Shefqz',

    photoURL: null

  };



  const setup = (props = {}) => {

    const onNavigate = vi.fn();

    const onRequestLogout = vi.fn();

    const onEndDay = vi.fn();

    return {

      ...render(

        <Header

          user={mockUser}

          onNavigate={onNavigate}

          onRequestLogout={onRequestLogout}

          onEndDay={onEndDay}

          trackingDayLabel="FRI, JUN 20"

          {...props}

        />

      ),

      onNavigate,

      onRequestLogout,

      onEndDay

    };

  };



  it('renders brand mark', () => {

    setup();

    expect(screen.getByText('t')).toBeDefined();

    expect(screen.getByText('++')).toBeDefined();

  });



  it('navigates to track when brand is clicked', () => {

    const { onNavigate } = setup();

    fireEvent.click(screen.getByText('t'));

    expect(onNavigate).toHaveBeenCalledWith('track');

  });



  it('opens profile menu and navigates to settings', () => {

    const { onNavigate } = setup();

    fireEvent.click(screen.getByRole('button', { name: 'Profile menu' }));

    const calibration = screen.getByText('Calibration');

    fireEvent.click(calibration);

    expect(onNavigate).toHaveBeenCalledWith('control');

  });



  it('fires end day when button clicked', () => {

    const { onEndDay } = setup();

    fireEvent.click(screen.getByText(/End Day/i));

    expect(onEndDay).toHaveBeenCalledTimes(1);

  });



  it('always shows end day button', () => {

    setup();

    expect(screen.getByText(/End Day/i)).toBeDefined();

  });

});


