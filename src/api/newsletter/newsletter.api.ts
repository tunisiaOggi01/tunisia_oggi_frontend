import { apiClient } from '../client';

/** POST /public/newsletter/subscribe — 201 on success, 409 when the email is already active. */
export async function subscribeToNewsletter(email: string): Promise<void> {
  await apiClient.post('/public/newsletter/subscribe', { email });
}