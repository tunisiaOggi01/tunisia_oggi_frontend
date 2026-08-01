import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAbility } from '../../hooks/auth/useAbility';
import { useTranslation } from 'react-i18next';

/** Route guard: only users with 'manage' ability may access /admin/*. Others get redirected home. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const ability = useAbility();
  const { pathname } = useLocation();

  if (isLoading) return <div className="p-8 text-center text-gray-500">{t('components.requireAuth.loading')}</div>;
  if (!user) return <Navigate to={`/admin/login?redirect=${encodeURIComponent(pathname)}`} replace />;
  if (!ability.can('manage', 'all')) return <Navigate to="/" replace />;

  return <>{children}</>;
}
