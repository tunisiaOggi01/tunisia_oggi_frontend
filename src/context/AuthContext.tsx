import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { login as loginRequest, logoutRequest, fetchCurrentUser } from '../api/auth/auth.api';
import type { AuthUser } from '../api/auth/types';
import { apiClient, setCsrfToken } from '../api/client';

const TOKEN_REFRESH_MS = 14 * 60 * 1000;

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearRefreshTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function startRefreshTimer() {
    clearRefreshTimer();
    timerRef.current = setInterval(async () => {
      try {
        const res = await apiClient.post('/auth/refresh');
        const newCsrf = res.data?.csrfToken;
        if (newCsrf) setCsrfToken(newCsrf);
      } catch {
        clearRefreshTimer();
        setCsrfToken(null);
        setUser(null);
      }
    }, TOKEN_REFRESH_MS);
  }

  const refreshUser = useCallback(async () => {
    try {
      const u = await fetchCurrentUser();
      setUser(u);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const csrf = searchParams.get('csrf');
    const redirect = searchParams.get('redirect');
    if (csrf) {
      setCsrfToken(csrf);
      fetchCurrentUser()
        .then((u) => {
          setUser(u);
          startRefreshTimer();
          if (!u.profileCompleted) {
            navigate('/admin/complete-profile', { replace: true });
          } else if (redirect) {
            navigate(decodeURIComponent(redirect), { replace: true });
          } else {
            navigate('/admin', { replace: true });
          }
        })
        .catch(() => setUser(null))
        .finally(() => setIsLoading(false));
      return;
    }
    fetchCurrentUser()
      .then((u) => {
        setUser(u);
        if (u) startRefreshTimer();
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));

    return () => clearRefreshTimer();
  }, []);

  async function login(email: string, password: string): Promise<AuthUser> {
    const { user: loggedInUser, csrfToken } = await loginRequest(email, password);
    setCsrfToken(csrfToken);
    setUser(loggedInUser);
    startRefreshTimer();
    return loggedInUser;
  }

  async function logout() {
    clearRefreshTimer();
    await logoutRequest();
    setCsrfToken(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
