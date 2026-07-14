import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/** Route guard: renders children only if a session exists, otherwise redirects to /admin/login. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}
