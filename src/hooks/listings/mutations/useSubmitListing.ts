import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitListing } from '../../../api/listings/public.api';
import type { BusinessCategory } from '../../../api/listings/types';

export interface SubmitListingPayload {
  businessName: string;
  category: BusinessCategory;
  description?: string;
  phone: string;
  email: string;
  website?: string;
}

/** Wraps POST /listings — exposes the mutation result and refreshes the user's listing list. */
export function useSubmitListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitListingPayload) => submitListing(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', 'mine'] });
    },
  });
}