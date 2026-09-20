/** Ad slot positions across the site (mirrors the backend AdPlacement enum). */
export type AdPlacement = 'SIDEBAR' | 'IN_ARTICLE' | 'FOOTER' | 'HOME_STRIP';

/** Derived lifecycle status computed from dates by the backend (no toggle, no cron). */
export type AdStatus = 'PROGRAMMATA' | 'ATTIVA' | 'SCADUTA';

/** A sponsored ad as returned by the ads endpoints (status present on admin reads). */
export interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  placement: AdPlacement;
  advertiserName: string | null;
  advertiserEmail: string | null;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  maxImpressions: number | null;
  remainingImpressions: number | null;
  budgetExhausted: boolean;
  createdAt: string;
  status: AdStatus;
}

/** Aggregate counters for the admin ads manager. */
export interface AdStats {
  scheduled: number;
  active: number;
  expired: number;
  totalImpressions: number;
  totalClicks: number;
}

/** Payload for POST /admin/ads. */
export interface CreateAdPayload {
  title: string;
  imageUrl: string;
  linkUrl: string;
  placement: AdPlacement;
  advertiserName?: string;
  advertiserEmail?: string;
  startDate: string;
  endDate: string;
  maxImpressions?: number;
}

/** Payload for PATCH /admin/ads/:id — all fields optional for partial update. */
export interface UpdateAdPayload {
  title?: string;
  imageUrl?: string;
  linkUrl?: string;
  placement?: AdPlacement;
  advertiserName?: string;
  advertiserEmail?: string;
  startDate?: string;
  endDate?: string;
  maxImpressions?: number;
}

/** A single audit log entry for ad mutations. */
export interface AdLog {
  id: string;
  adminName: string;
  adminEmail: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  adTitle: string;
  advertisementId: string | null;
  changes: Record<string, { from: unknown; to: unknown }> | null;
  createdAt: string;
}

/** Paginated ad logs response. */
export interface AdLogPage {
  data: AdLog[];
  total: number;
  page: number;
  pageSize: number;
}