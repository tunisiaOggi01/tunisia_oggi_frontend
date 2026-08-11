/** Business directory taxonomy (mirrors the backend BusinessCategory enum). */
export type BusinessCategory =
  | 'RESTAURANT'
  | 'LAW'
  | 'REAL_ESTATE'
  | 'HEALTH'
  | 'SERVICES';

export type ListingStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

/** The contact action a visitor tapped on a listing — tracked server-side. */
export type ListingAction = 'PHONE' | 'EMAIL' | 'WEBSITE';

/** A directory entry as returned by the listings endpoints (status APPROVED on public reads). */
export interface BusinessListing {
  id: string;
  businessName: string;
  category: BusinessCategory;
  description: string | null;
  phone: string;
  email: string;
  website: string | null;
  status: ListingStatus;
  submittedAt: string;
  views: number;
  phoneClicks: number;
  emailClicks: number;
  websiteClicks: number;
}