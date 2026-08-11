import { useMutation } from '@tanstack/react-query';
import { subscribeToNewsletter } from '../../api/newsletter/newsletter.api';

/** Wraps POST /public/newsletter/subscribe — callers map 409 to the duplicate state. */
export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: (email: string) => subscribeToNewsletter(email),
    retry: false,
  });
}