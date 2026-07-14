export type PublicationStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';

/** Shape returned by every publication read endpoint (public and admin). */
export interface Publication {
  id: string;
  title: string;
  slug: string;
  body: string;
  status: PublicationStatus;
  featuredImageUrl: string | null;
  views: number;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
  category: { id: string; name: string; slug: string; color: string };
  author: { username: string; imageUrl: string | null };
}

/** Generic page envelope returned by every paginated publications listing endpoint. */
export interface PaginatedPublications {
  data: Publication[];
  total: number;
  page: number;
  pageSize: number;
}
