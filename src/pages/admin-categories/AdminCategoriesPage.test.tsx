import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { AdminCategoriesPage } from './AdminCategoriesPage';
import * as categoriesApi from '../../api/categories/categories.api';

vi.spyOn(categoriesApi, 'fetchCategories').mockResolvedValue([
  { id: 'c1', name: 'National', slug: 'national', description: null, color: '#8B1E1E', articleCount: 1248 },
  { id: 'c2', name: 'Politics', slug: 'politics', description: null, color: '#1E3A8A', articleCount: 856 },
]);

const deleteSpy = vi.spyOn(categoriesApi, 'deleteCategory').mockResolvedValue();

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AdminCategoriesPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('AdminCategoriesPage', () => {
  it('renders the category table with slug and article count', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('National')).toBeInTheDocument();
    });
    expect(screen.getByText('/national')).toBeInTheDocument();
    expect(screen.getByText('1,248')).toBeInTheDocument();
  });

  it('deletes a category when the delete action is clicked', async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => screen.getByText('National'));
    await user.click(screen.getByLabelText('Delete Politics'));

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith('c2');
    });
  });
});
