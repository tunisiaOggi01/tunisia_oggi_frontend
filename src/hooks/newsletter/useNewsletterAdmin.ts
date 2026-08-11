import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchNewsletterStats,
  fetchSubscribers,
  softDeleteSubscriber,
} from '../../api/newsletter/admin.api';

/** Composes the admin newsletter queries + soft-delete mutation with auto-refresh. */
export function useNewsletterAdmin(page: number) {
  const queryClient = useQueryClient();

  const stats = useQuery({ queryKey: ['newsletter', 'stats'], queryFn: fetchNewsletterStats });
  const subscribers = useQuery({
    queryKey: ['newsletter', 'subscribers', page],
    queryFn: () => fetchSubscribers(page),
  });

  const remove = useMutation({
    mutationFn: (id: string) => softDeleteSubscriber(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter', 'subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['newsletter', 'stats'] });
    },
  });

  return { stats: stats.data, subscribers: subscribers.data, remove };
}