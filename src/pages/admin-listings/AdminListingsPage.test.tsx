import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AdminListingsPage } from './AdminListingsPage';

const reviewMutate = vi.fn();

vi.mock('../../hooks/listings/admin/useListingsAdmin', () => ({
  useListingsAdmin: () => ({
    listings: {
      data: [
        {
          id: 'l1',
          businessName: 'Ristorante La Medina',
          category: 'RESTAURANT',
          description: null,
          phone: '+216 71 000 111',
          email: 'info@lamedina.tn',
          website: null,
          status: 'PENDING',
          submittedAt: '2026-08-12T08:00:00.000Z',
          views: 0,
          phoneClicks: 0,
          emailClicks: 0,
          websiteClicks: 0,
        },
      ],
      total: 1,
      page: 1,
      pageSize: 10,
    },
    stats: { pending: 1, approved: 0, rejected: 0, totalViews: 0, totalClicks: 0 },
    review: { mutate: reviewMutate, isPending: false, variables: null },
    remove: { mutate: vi.fn(), isPending: false, variables: null },
  }),
}));

describe('AdminListingsPage', () => {
  it('renders the pending listing and approves it on button click', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AdminListingsPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Ristorante La Medina')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Approve' }));
    expect(reviewMutate).toHaveBeenCalledWith({ id: 'l1', status: 'APPROVED' });
  });
});