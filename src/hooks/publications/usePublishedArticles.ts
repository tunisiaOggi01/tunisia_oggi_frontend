import { useQuery } from '@tanstack/react-query';
import { fetchPublishedPublications } from '../../api/publications/public.api';

/** Wraps GET /publications in a query hook; used by the homepage and category page. */
export function usePublishedArticles(params: { page?: number; pageSize?: number; categorySlug?: string }) {
  return useQuery({
    queryKey: ['publications', 'published', params],
    queryFn: () => fetchPublishedPublications(params),
  });
}
