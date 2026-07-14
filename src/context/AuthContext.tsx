import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { login as loginRequest, logoutRequest, fetchCurrentUser } from '../api/auth/auth.api';
import type { AuthUser } from '../api/auth/types';
import { setCsrfToken } from '../api/client';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Provides the current admin session (if any) to the whole app; rehydrates it from the session cookie on mount. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { user: loggedInUser, csrfToken } = await loginRequest(email, password);
    setCsrfToken(csrfToken);
    setUser(loggedInUser);
  }

  async function logout() {
    await logoutRequest();
    setCsrfToken(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>;
}

/** Reads the current session; throws if used outside an AuthProvider. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
