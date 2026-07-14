import { useQueryClient } from '@tanstack/react-query';
import { deleteCategory as deleteCategoryRequest } from '../../api/categories/categories.api';

/** Wraps category write operations and the cache invalidation that follows them. */
export function useCategoryMutations() {
  const queryClient = useQueryClient();

  async function deleteCategory(id: string) {
    await deleteCategoryRequest(id);
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  }

  return { deleteCategory };
}
