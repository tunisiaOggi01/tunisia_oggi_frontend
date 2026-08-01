import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from './Navbar';
import * as AuthContext from '../../context/AuthContext';

vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
  user: null, isLoading: false, login: vi.fn(), logout: vi.fn(), refreshUser: vi.fn(),
});

describe('Navbar', () => {
  it('renders the site name and category links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getByText('Tunisia Oggi')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'National' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Log In' })).toHaveAttribute('href', '/admin/login');
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/admin/register');
  });
});
