import { apiClient, setCsrfToken } from '../client';
import type { AuthUser } from './types';

export async function login(email: string, password: string): Promise<{ user: AuthUser; csrfToken: string }> {
  const res = await apiClient.post('/auth/login', { email, password });
  return res.data;
}

export async function register(email: string, username: string, password: string): Promise<{ user: AuthUser }> {
  const res = await apiClient.post('/auth/register', { email, username, password });
  return res.data;
}

export async function updateProfile(data: { imageUrl?: string; description?: string }): Promise<AuthUser> {
  const res = await apiClient.patch('/auth/profile', data);
  return res.data;
}

export async function updateHeardAbout(source: string): Promise<AuthUser> {
  const res = await apiClient.patch('/auth/heard-about', { source });
  return res.data;
}

export async function forgotPassword(email: string): Promise<{ message: string; code?: string }> {
  const res = await apiClient.post('/auth/forgot-password', { email });
  return res.data;
}

export async function resetPassword(email: string, otpCode: string, newPassword: string): Promise<{ message: string }> {
  const res = await apiClient.post('/auth/reset-password', { email, otpCode, newPassword });
  return res.data;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const res = await apiClient.get('/auth/me');
  const { user, csrfToken } = res.data;
  if (csrfToken) setCsrfToken(csrfToken);
  return user;
}

export async function refreshSession(): Promise<{ csrfToken: string }> {
  const res = await apiClient.post('/auth/refresh');
  return res.data;
}

export async function logoutRequest(): Promise<void> {
  await apiClient.post('/auth/logout');
}

/** PATCH /auth/settings/username — changes the current user's username. */
export async function changeUsername(username: string): Promise<AuthUser> {
  const res = await apiClient.patch('/auth/settings/username', { username });
  return res.data;
}

/** PATCH /auth/settings/email — changes the current user's email. */
export async function changeEmail(email: string): Promise<AuthUser> {
  const res = await apiClient.patch('/auth/settings/email', { email });
  return res.data;
}

/** PATCH /auth/settings/password — changes password (requires current password). */
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiClient.patch('/auth/settings/password', { currentPassword, newPassword });
}
