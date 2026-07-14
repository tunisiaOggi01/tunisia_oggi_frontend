import { apiClient } from '../client';
import type { Category } from './types';

/** GET /categories — public, no auth required. */
export async function fetchCategories(): Promise<Category[]> {
  const res = await apiClient.get('/categories');
  return res.data;
}

/** POST /categories — SUPER_ADMIN only. */
export async function createCategory(payload: { name: string; slug: string; description?: string; color?: string }) {
  const res = await apiClient.post('/categories', payload);
  return res.data;
}

/** DELETE /categories/:id — SUPER_ADMIN only. */
export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}
