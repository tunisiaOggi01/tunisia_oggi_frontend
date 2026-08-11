import { useQuery } from '@tanstack/react-query';
import { fetchMyListings } from '../../api/listings/mine.api';

/** Wraps GET /listings/mine in a query hook — requires an authenticated session. */
export function useMyListings() {
  return useQuery({
    queryKey: ['listings', 'mine'],
    queryFn: fetchMyListings,
    retry: false,
  });
}