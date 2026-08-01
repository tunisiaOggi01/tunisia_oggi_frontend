import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { login as loginRequest, logoutRequest, fetchCurrentUser } from '../api/auth/auth.api';
import type { AuthUser } from '../api/auth/types';
import { setCsrfToken } from '../api/client';

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
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string): Promise<AuthUser> {
    const { user: loggedInUser, csrfToken } = await loginRequest(email, password);
    setCsrfToken(csrfToken);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function logout() {
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
