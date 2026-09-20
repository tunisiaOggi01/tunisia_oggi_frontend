import { useQuery } from '@tanstack/react-query';
import { fetchAdLogs } from '../../api/ads/admin.api';

/** Fetches paginated ad audit logs. */
export function useAdLogs(page: number = 1, pageSize: number = 20) {
  return useQuery({
    queryKey: ['ads', 'logs', page, pageSize],
    queryFn: () => fetchAdLogs({ page, pageSize }),
  });
}
