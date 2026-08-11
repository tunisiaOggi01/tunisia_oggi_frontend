import { useMutation } from '@tanstack/react-query';
import { trackAdEvent } from '../../../api/ads/public.api';

/** Wraps POST /public/ads/:id/impression|click — fire-and-forget, throttled server-side. */
export function useAdEvent() {
  return useMutation({
    mutationFn: ({ id, event }: { id: string; event: 'impression' | 'click' }) =>
      trackAdEvent(id, event),
    retry: false,
  });
}