import axios from 'axios';

/** Shared axios instance: cross-site cookies enabled, CSRF header attached to mutating requests. */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  withCredentials: true,
});

let csrfToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason: unknown) => void }> = [];

function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(undefined)));
  failedQueue = [];
}

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

/** Unwraps the standardized { success, data, latency, date } envelope and auto-refreshes on 401. */
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      if (response.data.success) {
        response.data = response.data.data;
      } else {
        return Promise.reject(new Error(response.data.error));
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry || originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      originalRequest._retry = true;
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => apiClient(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await apiClient.post('/auth/refresh');
      const newCsrf = res.data?.csrfToken;
      if (newCsrf) setCsrfToken(newCsrf);
      processQueue(null);
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      setCsrfToken(null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
