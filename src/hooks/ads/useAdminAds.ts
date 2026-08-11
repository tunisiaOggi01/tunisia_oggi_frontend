import { useQuery } from '@tanstack/react-query';
import { fetchAdminAds } from '../../api/ads/admin.api';
import type { AdPlacement } from '../../api/ads/types';

/** Wraps the admin paginated ads list (placement filter + page). */
export function useAdminAds(placement: AdPlacement | undefined, page: number) {
  return useQuery({
    queryKey: ['ads', 'admin', placement ?? 'all', page],
    queryFn: () => fetchAdminAds({ placement, page, pageSize: 10 }),
  });
}