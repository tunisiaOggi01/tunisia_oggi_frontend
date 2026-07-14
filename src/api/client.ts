import axios from 'axios';

/** Shared axios instance: cross-site cookies enabled, CSRF header attached to mutating requests. */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  withCredentials: true,
});

let csrfToken: string | null = null;

/** Sets (or clears, with null) the CSRF token attached to future mutating requests. Called by AuthContext. */
export function setCsrfToken(token: string | null) {
  csrfToken = token;
}

apiClient.interceptors.request.use((config) => {
  if (csrfToken && ['post', 'patch', 'delete', 'put'].includes(config.method ?? '')) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});
