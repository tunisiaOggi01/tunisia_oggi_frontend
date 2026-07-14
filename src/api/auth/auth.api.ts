import { apiClient } from '../client';
import type { AuthUser } from './types';

/** POST /auth/login — sets the session cookie server-side, returns the user + CSRF token. */
export async function login(email: string, password: string): Promise<{ user: AuthUser; csrfToken: string }> {
  const res = await apiClient.post('/auth/login', { email, password });
  return res.data;
}

/** GET /auth/me — rejects if there is no valid session cookie. */
export async function fetchCurrentUser(): Promise<AuthUser> {
  const res = await apiClient.get('/auth/me');
  return res.data;
}

/** POST /auth/logout — clears the session cookie server-side. */
export async function logoutRequest(): Promise<void> {
  await apiClient.post('/auth/logout');
}
