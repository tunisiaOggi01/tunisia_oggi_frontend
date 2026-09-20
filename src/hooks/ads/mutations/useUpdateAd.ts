import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAd } from '../../../api/ads/admin.api';
import type { UpdateAdPayload } from '../../../api/ads/types';

/** Wraps PATCH /admin/ads/:id and refreshes the admin list + stats on success. */
export function useUpdateAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAdPayload }) =>
      updateAd(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads', 'admin'] });
      queryClient.invalidateQueries({ queryKey: ['ads', 'stats'] });
    },
  });
}
