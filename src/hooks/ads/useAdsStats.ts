import { useQuery } from '@tanstack/react-query';
import { fetchAdStats } from '../../api/ads/admin.api';

/** Wraps GET /admin/ads/stats. */
export function useAdsStats() {
  return useQuery({ queryKey: ['ads', 'stats'], queryFn: fetchAdStats });
}