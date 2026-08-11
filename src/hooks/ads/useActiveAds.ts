import { useQuery } from '@tanstack/react-query';
import { fetchActiveAds } from '../../api/ads/public.api';
import type { AdPlacement } from '../../api/ads/types';

/** Wraps the public active-ad lookup in a query keyed by placement + limit. */
export function useActiveAds(placement: AdPlacement, limit: number) {
  return useQuery({
    queryKey: ['ads', 'active', placement, limit],
    queryFn: () => fetchActiveAds(placement, limit),
  });
}