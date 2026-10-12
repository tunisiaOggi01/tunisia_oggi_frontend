import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

/**
 * Holds rendering until the session check finishes. Pages that redirect when `user` is null
 * would otherwise bounce a logged-in user to /admin/login on a hard reload.
 */
export function WaitForAuth({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { isLoading } = useAuth();

  if (isLoading) return <div className="p-8 text-center text-gray-500">{t('components.requireAuth.loading')}</div>;

  return <>{children}</>;
}
