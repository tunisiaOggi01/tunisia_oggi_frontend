import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteListing,
  fetchAdminListings,
  fetchListingStats,
  updateListingStatus,
} from '../../../api/listings/admin.api';
import type { ListingStatus } from '../../../api/listings/types';

/** Composes the admin review queue queries + status/delete mutations with auto-refresh. */
export function useListingsAdmin(status: ListingStatus | undefined, page: number) {
  const queryClient = useQueryClient();

  const listings = useQuery({
    queryKey: ['admin', 'listings', status ?? 'all', page],
    queryFn: () => fetchAdminListings({ status, page, pageSize: 10 }),
  });
  const stats = useQuery({ queryKey: ['admin', 'listings', 'stats'], queryFn: fetchListingStats });

  const review = useMutation({
    mutationFn: ({ id, status: next }: { id: string; status: ListingStatus }) =>
      updateListingStatus(id, next),
    onSuccess: () => refresh(),
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteListing(id),
    onSuccess: () => refresh(),
  });

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ['admin', 'listings'] });
  }

  return { listings: listings.data, stats: stats.data, review, remove };
}