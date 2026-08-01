import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPublicationBySlug, fetchRelatedPublications, viewPublication, reactToPublication, removeReaction } from '../../api/publications/public.api';
import { useAuth } from '../../context/AuthContext';

/** Wraps the detail + related-articles fetches, view-recording, and reactions for a single article slug. */
export function useArticleDetail(slug: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  useEffect(() => {
    if (!slug || !publicationQuery.data?.id || !user) return;
    viewPublication(publicationQuery.data.id).catch(() => {});
  }, [slug, publicationQuery.data?.id, user]);

  const reactMut = useMutation({
    mutationFn: (type: string) => reactToPublication(publicationQuery.data!.id, type),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['publications', 'detail', slug] }),
  });

  const unreactMut = useMutation({
    mutationFn: () => removeReaction(publicationQuery.data!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['publications', 'detail', slug] }),
  });

  return {
    publication: publicationQuery.data,
    related: relatedQuery.data,
    isLoading: publicationQuery.isLoading,
    react: (type: string) => reactMut.mutate(type),
    unreact: () => unreactMut.mutate(),
    isReacting: reactMut.isPending || unreactMut.isPending,
  };
}
