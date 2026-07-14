import { apiClient } from '../client';
import type { Publication, PaginatedPublications } from './types';

/** GET /publications — published articles only, optionally filtered by category/search. */
export async function fetchPublishedPublications(params: {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  search?: string;
}): Promise<PaginatedPublications> {
  const res = await apiClient.get('/publications', { params: { status: 'PUBLISHED', ...params } });
  return res.data;
}

/** GET /publications/:slug — increments the view counter server-side. */
export async function fetchPublicationBySlug(slug: string): Promise<Publication> {
  const res = await apiClient.get(`/publications/${slug}`);
  return res.data;
}

/** GET /publications/:slug/related — up to 3 same-category articles, excluding itself. */
export async function fetchRelatedPublications(slug: string): Promise<Publication[]> {
  const res = await apiClient.get(`/publications/${slug}/related`);
  return res.data;
}
