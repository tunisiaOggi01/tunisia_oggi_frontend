import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LINKS = [
  { to: '/admin/articles', label: 'components.adminSidebar.articles' },
  { to: '/admin/categories', label: 'components.adminSidebar.categories' },
  { to: '/admin/listings', label: 'components.adminSidebar.listings' },
  { to: '/admin/ads', label: 'components.adminSidebar.ads' },
  { to: '/admin/newsletter', label: 'components.adminSidebar.newsletter' },
];

/** Left nav for the admin CMS: Articles / Categories, highlighting the active route. */
export function AdminSidebar() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <aside className="w-56 border-r border-gray-200 p-6">
      <p className="font-serif text-lg font-bold text-brand">{t('components.adminSidebar.brand')}</p>
      <p className="text-xs text-gray-500">{t('components.adminSidebar.subtitle')}</p>
      <nav className="mt-8 space-y-1">
        {LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`block rounded px-3 py-2 text-sm ${
              location.pathname === link.to ? 'bg-brand/10 font-semibold text-brand' : 'text-gray-600'
            }`}
          >
            {t(link.label)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
