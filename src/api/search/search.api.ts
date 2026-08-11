import { apiClient } from '../client';
import type { Publication } from '../publications/types';
import type { BusinessListing } from '../listings/types';

/** Category + hit count from the search sidebar. */
export interface CategoryCount {
  id: string;
  name: string;
  slug: string;
  count: number;
}

/** Combined payload of GET /public/search — articles page + top listings + category counts. */
export interface SearchResults {
  articles: Publication[];
  totalArticles: number;
  page: number;
  pageSize: number;
  listings: BusinessListing[];
  categoryCounts: CategoryCount[];
}

/** GET /public/search?q=&page= — 9 articles per page, accent-insensitive on both texts. */
export async function searchAll(q: string, page: number): Promise<SearchResults> {
  const res = await apiClient.get('/public/search', {
    params: { q, page, pageSize: 9 },
  });
  return res.data;
}