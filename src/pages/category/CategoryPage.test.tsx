import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { CategoryPage } from './CategoryPage';
import * as publicationsApi from '../../api/publications/public.api';

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
      tags: [],
      publishedAt: '2026-07-01T00:00:00.000Z',
      createdAt: '2026-07-01T00:00:00.000Z',
      category: { id: 'c1', name: 'Politics', slug: 'politics', color: '#1E3A8A' },
      author: { username: 'editor', imageUrl: null },
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
      expect(screen.getByText('New Parliamentary Session Opens with Focus on Economic Reform')).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: 'Politics' })).toBeInTheDocument();
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ categorySlug: 'politics' }));
  });
});
