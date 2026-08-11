import { apiClient } from '../client';
import type { AdPlacement, Advertisement } from './types';

/** GET /public/ads?placement=&limit= — active ads for a slot, newest start date first. */
export async function fetchActiveAds(
  placement: AdPlacement,
  limit: number,
): Promise<Advertisement[]> {
  const res = await apiClient.get('/public/ads', { params: { placement, limit } });
  return res.data;
}

/** POST /public/ads/:id/impression|click — fire-and-forget counter; 404 when not active. */
export async function trackAdEvent(id: string, event: 'impression' | 'click'): Promise<void> {
  await apiClient.post(`/public/ads/${id}/${event}`);
}