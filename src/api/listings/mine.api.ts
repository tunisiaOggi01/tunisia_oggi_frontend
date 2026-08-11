import { apiClient } from '../client';
import type { BusinessListing } from './types';

/** GET /listings/mine — the authenticated user's own submissions, newest first. */
export async function fetchMyListings(): Promise<BusinessListing[]> {
  const res = await apiClient.get('/listings/mine');
  return res.data;
}

/** GET /listings/mine/:id/stats — owner-only counter view; 403 for foreign listings. */
export async function fetchMyListingStats(id: string): Promise<{
  views: number;
  phoneClicks: number;
  emailClicks: number;
  websiteClicks: number;
}> {
  const res = await apiClient.get(`/listings/mine/${id}/stats`);
  return res.data;
}