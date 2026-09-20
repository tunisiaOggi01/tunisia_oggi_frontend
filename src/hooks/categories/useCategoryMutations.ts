import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCategory as createCategoryRequest,
  deleteCategory as deleteCategoryRequest,
} from '../../api/categories/categories.api';

/** Wraps category write operations and the cache invalidation that follows them. */
export function useCategoryMutations() {
  const queryClient = useQueryClient();

  const createCategory = useMutation({
    mutationFn: createCategoryRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const deleteCategory = useMutation({
    mutationFn: deleteCategoryRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  return { createCategory, deleteCategory };
}
