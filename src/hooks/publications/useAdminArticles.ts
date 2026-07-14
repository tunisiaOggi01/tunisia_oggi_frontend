import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchPublicationStats,
  fetchAdminPublications,
  deletePublication,
} from '../../api/publications/admin.api';

/** Wraps the admin dashboard's stats + article-list + delete-mutation into one hook. */
export function useAdminArticles(search: string) {
  const queryClient = useQueryClient();

  const statsQuery = useQuery({ queryKey: ['publications', 'stats'], queryFn: fetchPublicationStats });
  const articlesQuery = useQuery({
    queryKey: ['publications', 'admin', search],
    queryFn: () => fetchAdminPublications({ page: 1, pageSize: 10, search: search || undefined }),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['publications', 'admin'] });
    queryClient.invalidateQueries({ queryKey: ['publications', 'stats'] });
  }

  async function handleDelete(id: string) {
    await deletePublication(id);
    invalidate();
  }

  return { stats: statsQuery.data, articles: articlesQuery.data, handleDelete, refetch: invalidate };
}
