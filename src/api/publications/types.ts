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
  rankScore: number;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
  category: { id: string; name: string; slug: string; color: string };
  author: { id: string; username: string; imageUrl: string | null };
  reactionCount?: number;
  userReaction?: string | null;
}

/** Generic page envelope returned by every paginated publications listing endpoint. */
export interface PaginatedPublications {
  data: Publication[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ViewResult {
  viewed: boolean;
  views?: number;
  rankScore?: number;
}

export interface ReactionResult {
  reacted: boolean;
  type?: string;
  reactionCount?: number;
  unreacted?: boolean;
}
