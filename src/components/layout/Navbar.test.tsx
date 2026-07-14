import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('renders the site name and category links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getByText('TUNISIA OGGI')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'National' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Admin Login' })).toHaveAttribute('href', '/admin/login');
  });
});
