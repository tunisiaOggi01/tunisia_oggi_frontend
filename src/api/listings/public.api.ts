import { apiClient } from '../client';
import type { BusinessListing, BusinessCategory, ListingAction } from './types';

export interface ListingQuery {
  category?: BusinessCategory;
  search?: string;
}

/** GET /public/listings — approved entries, optionally filtered by category. */
export async function fetchApprovedListings(
  params: ListingQuery,
): Promise<BusinessListing[]> {
  const res = await apiClient.get('/public/listings', { params });
  return res.data;
}

/** GET /public/listings/:id — approved entry only; increments the view counter. */
export async function fetchListingDetail(id: string): Promise<BusinessListing> {
  const res = await apiClient.get(`/public/listings/${id}`);
  return res.data;
}

/** POST /public/listings/:id/click — records a contact-action click (PHONE | EMAIL | WEBSITE). */
export async function trackListingClick(
  id: string,
  action: ListingAction,
): Promise<BusinessListing> {
  const res = await apiClient.post(`/public/listings/${id}/click`, { action });
  return res.data;
}

/** POST /listings — authenticated submission, created as PENDING pending admin review. */
export async function submitListing(payload: {
  businessName: string;
  category: BusinessCategory;
  description?: string;
  phone: string;
  email: string;
  website?: string;
}): Promise<BusinessListing> {
  const res = await apiClient.post('/listings', payload);
  return res.data;
}