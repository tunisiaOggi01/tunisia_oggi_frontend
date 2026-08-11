import { apiClient } from '../client';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  confirmedAt: string | null;
  subscribedAt: string;
}

export interface NewsletterStats {
  active: number;
  newThisWeek: number;
  softDeleted: number;
}

export interface NewsletterPage {
  data: NewsletterSubscriber[];
  total: number;
  page: number;
  pageSize: number;
}

/** GET /admin/newsletter/subscribers — active subscribers, 10 per page. */
export async function fetchSubscribers(page: number): Promise<NewsletterPage> {
  const res = await apiClient.get('/admin/newsletter/subscribers', {
    params: { page, pageSize: 10 },
  });
  return res.data;
}

/** GET /admin/newsletter/stats — totals, last-7-days, all-time soft-deleted. */
export async function fetchNewsletterStats(): Promise<NewsletterStats> {
  const res = await apiClient.get('/admin/newsletter/stats');
  return res.data;
}

/** DELETE /admin/newsletter/subscribers/:id — soft delete, 204. */
export async function softDeleteSubscriber(id: string): Promise<void> {
  await apiClient.delete(`/admin/newsletter/subscribers/${id}`);
}

/** GET /admin/newsletter/export — downloads the full subscriber CSV via blob. */
export async function exportSubscribersCsv(): Promise<void> {
  const res = await apiClient.get('/admin/newsletter/export', {
    responseType: 'blob',
  });
  const url = URL.createObjectURL(res.data as Blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'subscribers.csv';
  link.click();
  URL.revokeObjectURL(url);
}