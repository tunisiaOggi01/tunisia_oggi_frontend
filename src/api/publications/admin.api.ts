import { apiClient } from '../client';
import type { Publication, PaginatedPublications, PublicationStatus } from './types';

export interface PublicationStats {
  totalArticles: number;
  activeDrafts: number;
  totalViews: number;
  comments: number;
}

/** POST /admin/publications — creates a draft or immediately-published article. */
export async function createPublication(payload: {
  title: string;
  categoryId: string;
  body: string;
  featuredImageUrl?: string;
  status: PublicationStatus;
  scheduledAt?: string;
}): Promise<Publication> {
  const res = await apiClient.post('/admin/publications', payload);
  return res.data;
}

/** GET /admin/publications/stats — dashboard tile data; comments is always 0 (no comment system yet). */
export async function fetchPublicationStats(): Promise<PublicationStats> {
  const res = await apiClient.get('/admin/publications/stats');
  return res.data;
}

/** GET /admin/publications — every status, paginated, optionally filtered by title search or authorId. */
export async function fetchAdminPublications(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  authorId?: string;
}): Promise<PaginatedPublications> {
  const res = await apiClient.get('/admin/publications', { params });
  return res.data;
}

/** GET /admin/publications/:id — single publication with category and author info. */
export async function fetchAdminPublicationById(id: string): Promise<Publication> {
  const res = await apiClient.get(`/admin/publications/${id}`);
  return res.data;
}

/** PATCH /admin/publications/:id — updates title, body, status, etc. */
export async function updatePublication(id: string, payload: Partial<{
  title: string;
  categoryId: string;
  body: string;
  featuredImageUrl?: string;
  status: PublicationStatus;
  scheduledAt?: string;
}>): Promise<Publication> {
  const res = await apiClient.patch(`/admin/publications/${id}`, payload);
  return res.data;
}

/** DELETE /admin/publications/:id. */
export async function deletePublication(id: string): Promise<void> {
  await apiClient.delete(`/admin/publications/${id}`);
}
