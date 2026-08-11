import { useQuery } from '@tanstack/react-query';
import { fetchApprovedListings } from '../../api/listings/public.api';
import type { ListingQuery } from '../../api/listings/public.api';

/** Wraps GET /public/listings in a query hook, keyed by category/search filters. */
export function useListings(params: ListingQuery) {
  return useQuery({
    queryKey: ['listings', 'approved', params],
    queryFn: () => fetchApprovedListings(params),
  });
}