import { useMutation } from '@tanstack/react-query';
import { trackListingClick } from '../../../api/listings/public.api';
import type { ListingAction } from '../../../api/listings/types';

/** Wraps POST /public/listings/:id/click — fired before the browser follows the contact link. */
export function useTrackListingClick() {
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: ListingAction }) =>
      trackListingClick(id, action),
    retry: false,
  });
}