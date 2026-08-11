import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAd } from '../../../api/ads/admin.api';
import type { CreateAdPayload } from '../../../api/ads/types';

/** Wraps POST /admin/ads and refreshes the admin list + stats on success. */
export function useCreateAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdPayload) => createAd(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads', 'admin'] });
      queryClient.invalidateQueries({ queryKey: ['ads', 'stats'] });
    },
  });
}