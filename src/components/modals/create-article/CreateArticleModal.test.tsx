import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { CreateArticleModal } from './CreateArticleModal';
import * as categoriesApi from '../../../api/categories/categories.api';
import * as publicationsAdminApi from '../../../api/publications/admin.api';

vi.spyOn(categoriesApi, 'fetchCategories').mockResolvedValue([
  { id: 'c1', name: 'National', slug: 'national', description: null, color: '#8B1E1E', articleCount: 0 },
  { id: 'c2', name: 'Politics', slug: 'politics', description: null, color: '#1E3A8A', articleCount: 0 },
]);

const createSpy = vi.spyOn(publicationsAdminApi, 'createPublication').mockResolvedValue({ id: 'p1' } as any);

function renderModal(onCreated = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <CreateArticleModal isOpen onClose={vi.fn()} onCreated={onCreated} />
    </QueryClientProvider>,
  );
}

describe('CreateArticleModal', () => {
  it('submits a draft with title, category, and content', async () => {
    const user = userEvent.setup();
    const onCreated = vi.fn();
    renderModal(onCreated);

    await user.type(screen.getByLabelText('Article Title'), 'Test Article');
    await waitFor(() => expect(screen.getByRole('option', { name: 'Politics' })).toBeInTheDocument());
    await user.selectOptions(screen.getByLabelText('Category'), 'Politics');
    await user.type(screen.getByPlaceholderText('Start writing your story...'), 'Some article content');
    await user.click(screen.getByRole('button', { name: 'Save Draft' }));

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Test Article', body: 'Some article content', status: 'DRAFT' }),
      );
      expect(onCreated).toHaveBeenCalled();
    });
  });
});
