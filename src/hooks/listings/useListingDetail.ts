import { useQuery } from '@tanstack/react-query';
import { fetchListingDetail } from '../../api/listings/public.api';

/** Wraps GET /public/listings/:id in a query hook. */
export function useListingDetail(id: string) {
  return useQuery({
    queryKey: ['listings', 'detail', id],
    queryFn: () => fetchListingDetail(id),
    enabled: !!id,
  });
}