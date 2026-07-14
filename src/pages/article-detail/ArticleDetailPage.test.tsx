import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { ArticleDetailPage } from './ArticleDetailPage';
import * as publicationsApi from '../../api/publications/public.api';

const publication = {
  id: '1',
  title: 'Economic Outlook: Growth Projected for Tunisia in 2025',
  slug: 'economic-outlook-2025',
  body: "Tunisia's economic landscape is poised for a significant transformation...",
  status: 'PUBLISHED' as const,
  featuredImageUrl: 'https://example.com/hero.jpg',
  views: 42,
  tags: ['Economy', 'Tunisia2025'],
  publishedAt: '2026-07-01T00:00:00.000Z',
  createdAt: '2026-07-01T00:00:00.000Z',
  category: { id: 'c1', name: 'National', slug: 'national', color: '#8B1E1E' },
  author: { username: 'Sami Mansour', imageUrl: null },
};

vi.spyOn(publicationsApi, 'fetchPublicationBySlug').mockResolvedValue(publication);
vi.spyOn(publicationsApi, 'fetchRelatedPublications').mockResolvedValue([]);

function renderArticleDetailPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/article/economic-outlook-2025']}>
        <Routes>
          <Route path="/article/:slug" element={<ArticleDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ArticleDetailPage', () => {
  it('renders the article title, body, and author', async () => {
    renderArticleDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Economic Outlook: Growth Projected for Tunisia in 2025')).toBeInTheDocument();
    });
    expect(screen.getByText(/Sami Mansour/)).toBeInTheDocument();
    expect(screen.getByText(/Tunisia's economic landscape/)).toBeInTheDocument();
  });
});
