import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPublishedPublications } from '../../api/publications/public.api';
import type { PaginatedPublications } from '../../api/publications/types';

/** Wraps GET /publications with infinite scroll support; paginates by page number. */
export function usePublishedArticles(params: {
  pageSize?: number;
  categorySlug?: string;
  search?: string;
  enabled?: boolean;
}) {
  const { enabled, ...queryParams } = params;
  return useInfiniteQuery<PaginatedPublications>({
    queryKey: ['publications', 'published', queryParams],
    queryFn: ({ pageParam }) => fetchPublishedPublications({ ...queryParams, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.pageSize);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: enabled ?? true,
  });
}
