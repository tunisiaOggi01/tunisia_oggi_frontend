import { useInfiniteQuery } from '@tanstack/react-query';
import { searchAll } from '../../api/search/search.api';

/** Infinite-query wrapper for the combined search — 9 results per page, disabled without a query. */
export function useSearchResults(q: string) {
  return useInfiniteQuery({
    queryKey: ['search', 'results', q],
    queryFn: ({ pageParam }) => searchAll(q, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page * last.pageSize < last.totalArticles ? last.page + 1 : undefined,
    enabled: q.trim().length > 0,
  });
}