import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAd } from '../../../api/ads/admin.api';

/** Wraps DELETE /admin/ads/:id and refreshes the admin list + stats on success. */
export function useDeleteAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAd(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads', 'admin'] });
      queryClient.invalidateQueries({ queryKey: ['ads', 'stats'] });
    },
  });
}