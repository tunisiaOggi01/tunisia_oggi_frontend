import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../../api/categories/categories.api';

/** Wraps GET /categories in a query hook — every component needing the category list uses this, never useQuery directly. */
export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
}
