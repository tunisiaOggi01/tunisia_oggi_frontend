import { useQuery } from '@tanstack/react-query';
import { fetchPublicationBySlug, fetchRelatedPublications } from '../../api/publications/public.api';

/** Wraps the detail + related-articles fetches for a single article slug. */
export function useArticleDetail(slug: string | undefined) {
  const publicationQuery = useQuery({
    queryKey: ['publications', 'detail', slug],
    queryFn: () => fetchPublicationBySlug(slug!),
    enabled: !!slug,
  });

  const relatedQuery = useQuery({
    queryKey: ['publications', 'related', slug],
    queryFn: () => fetchRelatedPublications(slug!),
    enabled: !!slug,
  });

  return {
    publication: publicationQuery.data,
    related: relatedQuery.data,
    isLoading: publicationQuery.isLoading,
  };
}
