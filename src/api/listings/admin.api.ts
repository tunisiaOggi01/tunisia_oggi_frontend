import { apiClient } from '../client';
import type { BusinessCategory, BusinessListing, ListingStatus } from './types';

/** Query params for GET /admin/listings — optional status/category/search filter. */
export interface AdminListingsQuery {
  status?: ListingStatus;
  category?: BusinessCategory;
  search?: string;
  page?: number;
  pageSize?: number;
}

/** Paginated admin review list (matches the backend admin page envelope). */
export interface AdminListingsPage {
  data: BusinessListing[];
  total: number;
  page: number;
  pageSize: number;
}

/** Aggregates from GET /admin/listings/stats. */
export interface ListingStats {
  pending: number;
  approved: number;
  rejected: number;
  totalViews: number;
  totalClicks: number;
}

/** GET /admin/listings — review queue, newest submissions first. */
export async function fetchAdminListings(query: AdminListingsQuery = {}): Promise<AdminListingsPage> {
  const res = await apiClient.get('/admin/listings', { params: query });
  return res.data;
}

/** GET /admin/listings/stats — queue counts and engagement totals. */
export async function fetchListingStats(): Promise<ListingStats> {
  const res = await apiClient.get('/admin/listings/stats');
  return res.data;
}

/** PATCH /admin/listings/:id — sets the review status (APPROVED | REJECTED | PENDING). */
export async function updateListingStatus(
  id: string,
  status: ListingStatus,
): Promise<BusinessListing> {
  const res = await apiClient.patch(`/admin/listings/${id}`, { status });
  return res.data;
}

/** DELETE /admin/listings/:id — hard delete, 204. */
export async function deleteListing(id: string): Promise<void> {
  await apiClient.delete(`/admin/listings/${id}`);
}