import { apiClient } from '../client';
import type { AdPlacement, AdStats, Advertisement, CreateAdPayload } from './types';

export interface AdminAdsQuery {
  placement?: AdPlacement;
  page?: number;
  pageSize?: number;
}

export interface AdminAdsPage {
  data: Advertisement[];
  total: number;
  page: number;
  pageSize: number;
}

/** GET /admin/ads — paginated ad list with placement filter and derived status. */
export async function fetchAdminAds(query: AdminAdsQuery = {}): Promise<AdminAdsPage> {
  const res = await apiClient.get('/admin/ads', { params: query });
  return res.data;
}

/** GET /admin/ads/stats — aggregate activeness and counter totals. */
export async function fetchAdStats(): Promise<AdStats> {
  const res = await apiClient.get('/admin/ads/stats');
  return res.data;
}

/** POST /admin/ads — creates an ad (validates endDate > startDate server-side). */
export async function createAd(payload: CreateAdPayload): Promise<Advertisement> {
  const res = await apiClient.post('/admin/ads', payload);
  return res.data;
}

/** DELETE /admin/ads/:id — hard delete, 204. */
export async function deleteAd(id: string): Promise<void> {
  await apiClient.delete(`/admin/ads/${id}`);
}