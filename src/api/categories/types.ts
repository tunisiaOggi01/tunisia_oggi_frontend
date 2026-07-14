/** A category as returned by GET /categories, including its computed article count. */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  articleCount: number;
}
