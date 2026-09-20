import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { CategoryPage } from './CategoryPage';
import * as publicationsApi from '../../api/publications/public.api';
import * as listingsApi from '../../api/listings/public.api';

vi.mock('../../hooks/ads/useActiveAds', () => ({
  useActiveAds: () => ({
    data: [
      {
        id: 'ad1',
        title: 'Villa Hammamet',
        imageUrl: 'https://example.com/ad.jpg',
        linkUrl: 'https://villa-hammamet.tn',
        placement: 'SIDEBAR',
        advertiserName: 'Villa Hammamet',
        startDate: '2026-08-10T00:00:00.000Z',
        endDate: '2026-09-10T00:00:00.000Z',
        impressions: 0,
        clicks: 0,
        createdAt: '2026-08-10T00:00:00.000Z',
      },
    ],
  }),
}));

const listingsSpy = vi.spyOn(listingsApi, 'fetchApprovedListings').mockResolvedValue([
  {
    id: 'l1',
    businessName: 'Trattoria Roma',
    category: 'RESTAURANT',
    description: 'Cucina italiana autentica nel cuore di Tunisi.',
    phone: '+216 71 111 222',
    email: 'info@trattoriaroma.tn',
    website: null,
    status: 'APPROVED',
    submittedAt: '2026-07-01T00:00:00.000Z',
    views: 12,
    phoneClicks: 3,
    emailClicks: 1,
    websiteClicks: 0,
  },
]);

const spy = vi.spyOn(publicationsApi, 'fetchPublishedPublications').mockResolvedValue({
  data: [
    {
      id: '1',
      title: 'New Parliamentary Session Opens with Focus on Economic Reform',
      slug: 'new-parliamentary-session',
      body: 'body',
      status: 'PUBLISHED',
      featuredImageUrl: null,
      views: 1,
      rankScore: 0,
      tags: [],
      publishedAt: '2026-07-01T00:00:00.000Z',
      createdAt: '2026-07-01T00:00:00.000Z',
      category: { id: 'c1', name: 'Politics', slug: 'politics', color: '#1E3A8A' },
      author: { id: 'u1', username: 'editor', imageUrl: null },
    },
  ],
  total: 1,
  page: 1,
  pageSize: 10,
});

function renderCategoryPage(slug: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/category/${slug}`]}>
        <Routes>
          <Route path="/category/:slug" element={<CategoryPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('CategoryPage', () => {
  it('fetches publications filtered by the URL category slug and shows the category title', async () => {
    renderCategoryPage('politics');

    await waitFor(() => {
      expect(screen.getAllByText('New Parliamentary Session Opens with Focus on Economic Reform').length).toBeGreaterThanOrEqual(1);
    });

    expect(screen.getByRole('heading', { name: 'Politics' })).toBeInTheDocument();
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ categorySlug: 'politics' }));
  });

  it('renders the sidebar ad and the services widget from the annuario', async () => {
    renderCategoryPage('politics');

    await waitFor(() => {
      expect(screen.getAllByText('Villa Hammamet').length).toBeGreaterThanOrEqual(1);
    });
    await waitFor(() => {
      expect(screen.getByText('Trattoria Roma')).toBeInTheDocument();
    });
    expect(listingsSpy).toHaveBeenCalled();
    expect(screen.getByRole('link', { name: 'View all' })).toHaveAttribute('href', '/directory');
  });
});
