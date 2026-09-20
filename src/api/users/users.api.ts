import { apiClient } from '../client';
import type { AdminUser } from './types';

/** GET /users — SUPER_ADMIN only. */
export async function fetchUsers(): Promise<AdminUser[]> {
  const res = await apiClient.get('/users');
  return res.data;
}

/** PATCH /users/:id/role — SUPER_ADMIN only. */
export async function updateUserRole(id: string, role: string): Promise<AdminUser> {
  const res = await apiClient.patch(`/users/${id}/role`, { role });
  return res.data;
}

/** DELETE /users/:id — SUPER_ADMIN only. */
export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}
