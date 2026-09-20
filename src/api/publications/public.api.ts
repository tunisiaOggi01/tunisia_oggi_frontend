import { apiClient } from '../client';
import type { Publication, PaginatedPublications, ViewResult, ReactionResult } from './types';

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

/** GET /publications/:slug — does NOT increment view count. */
export async function fetchPublicationBySlug(slug: string): Promise<Publication> {
  const res = await apiClient.get(`/publications/${slug}`);
  return res.data;
}

/** GET /publications/:slug/related — up to 3 same-category articles, excluding itself. */
export async function fetchRelatedPublications(slug: string): Promise<Publication[]> {
  const res = await apiClient.get(`/publications/${slug}/related`);
  return res.data;
}

/** POST /publications/:id/view — records a unique view for the authenticated user. */
export async function viewPublication(id: string): Promise<ViewResult> {
  const res = await apiClient.post(`/publications/${id}/view`);
  return res.data;
}

/** POST /publications/:id/react — adds or changes the current user's reaction. */
export async function reactToPublication(id: string, type = 'LIKE'): Promise<ReactionResult> {
  const res = await apiClient.post(`/publications/${id}/react`, { type });
  return res.data;
}

/** DELETE /publications/:id/react — removes the current user's reaction. */
export async function removeReaction(id: string): Promise<ReactionResult> {
  const res = await apiClient.delete(`/publications/${id}/react`);
  return res.data;
}

export interface MyReaction {
  id: string;
  type: string;
  createdAt: string;
  publication: Publication;
}

/** GET /publications/me/reactions — all reactions by the current user. */
export async function fetchMyReactions(): Promise<MyReaction[]> {
  const res = await apiClient.get('/publications/me/reactions');
  return res.data;
}
