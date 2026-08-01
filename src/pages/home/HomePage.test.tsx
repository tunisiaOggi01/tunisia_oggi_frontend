import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { HomePage } from './HomePage';
import { ToastProvider } from '../../components/common/Toast';
import * as AuthContext from '../../context/AuthContext';
import * as publicationsApi from '../../api/publications/public.api';

vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: null, isLoading: false, login: vi.fn(), logout: vi.fn(), refreshUser: vi.fn() });

vi.spyOn(publicationsApi, 'fetchPublishedPublications').mockResolvedValue({
  data: [
    {
      id: '1',
      title: 'New Cultural Hub Opens in Tunis',
      slug: 'new-cultural-hub-opens-in-tunis',
      body: 'The grand opening of the Mediterranean Arts Pavilion...',
      status: 'PUBLISHED',
      featuredImageUrl: 'https://example.com/hero.jpg',
      views: 10,
      rankScore: 0,
      tags: [],
      publishedAt: '2026-07-01T00:00:00.000Z',
      createdAt: '2026-07-01T00:00:00.000Z',
      category: { id: 'c1', name: 'Culture', slug: 'culture', color: '#8B1E1E' },
      author: { id: 'u1', username: 'editor', imageUrl: null },
    },
    {
      id: '2',
      title: 'Economic reform package approved by parliament',
      slug: 'economic-reform-package',
      body: 'body',
      status: 'PUBLISHED',
      featuredImageUrl: null,
      views: 3,
      rankScore: 0,
      tags: [],
      publishedAt: '2026-06-30T00:00:00.000Z',
      createdAt: '2026-06-30T00:00:00.000Z',
      category: { id: 'c2', name: 'Politics', slug: 'politics', color: '#1E3A8A' },
      author: { id: 'u1', username: 'editor', imageUrl: null },
    },
  ],
  total: 2,
  page: 1,
  pageSize: 5,
});

function renderHomePage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </ToastProvider>
    </QueryClientProvider>,
  );
}

describe('HomePage', () => {
  it('renders the most recent article as the hero and the rest in the latest grid', async () => {
    renderHomePage();

    await waitFor(() => {
      expect(screen.getAllByText('New Cultural Hub Opens in Tunis').length).toBeGreaterThanOrEqual(1);
    });
    expect(screen.getAllByText('Economic reform package approved by parliament').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Advertisement')).toBeInTheDocument();
  });
});
