import { apiClient } from '../client';
import type { AdLogPage, AdPlacement, AdStats, Advertisement, CreateAdPayload, UpdateAdPayload } from './types';

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

/** PATCH /admin/ads/:id — partial update of ad fields. */
export async function updateAd(id: string, payload: UpdateAdPayload): Promise<Advertisement> {
  const res = await apiClient.patch(`/admin/ads/${id}`, payload);
  return res.data;
}

/** GET /admin/ads/logs — paginated audit log of ad mutations. */
export async function fetchAdLogs(query: { page?: number; pageSize?: number } = {}): Promise<AdLogPage> {
  const res = await apiClient.get('/admin/ads/logs', { params: query });
  return res.data;
}