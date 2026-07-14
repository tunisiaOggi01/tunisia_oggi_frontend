import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { AdminArticlesPage } from './AdminArticlesPage';
import { AuthProvider } from '../../context/AuthContext';
import * as publicationsAdminApi from '../../api/publications/admin.api';
import * as authApi from '../../api/auth/auth.api';

vi.spyOn(authApi, 'fetchCurrentUser').mockResolvedValue({
  id: '1',
  email: 'admin@tunisiaoggi.com',
  username: 'admin',
  role: 'SUPER_ADMIN',
});

vi.spyOn(publicationsAdminApi, 'fetchPublicationStats').mockResolvedValue({
  totalArticles: 1284,
  activeDrafts: 24,
  totalViews: 45200,
  comments: 0,
});

vi.spyOn(publicationsAdminApi, 'fetchAdminPublications').mockResolvedValue({
  data: [
    {
      id: '1',
      title: 'The Economic Future of Tunis: A 2025 Vision',
      slug: 'economic-future-tunis',
      body: 'body',
      status: 'PUBLISHED',
      featuredImageUrl: null,
      views: 100,
      tags: [],
      publishedAt: '2026-07-01T00:00:00.000Z',
      createdAt: '2026-07-01T00:00:00.000Z',
      category: { id: 'c1', name: 'National', slug: 'national', color: '#8B1E1E' },
      author: { username: 'admin', imageUrl: null },
    },
  ],
  total: 1284,
  page: 1,
  pageSize: 10,
});

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthProvider>
          <AdminArticlesPage />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('AdminArticlesPage', () => {
  it('renders stat tiles and the article table, with the Comments tile hardcoded to 0', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('1,284')).toBeInTheDocument();
    });
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByText('0', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('The Economic Future of Tunis: A 2025 Vision')).toBeInTheDocument();
    expect(screen.getByText('PUBLISHED')).toBeInTheDocument();
  });
});
