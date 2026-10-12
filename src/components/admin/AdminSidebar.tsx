import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LINKS = [
  { to: '/admin', label: 'components.adminSidebar.dashboard', icon: 'dashboard' },
  { to: '/admin/articles', label: 'components.adminSidebar.articles', icon: 'article' },
  { to: '/admin/categories', label: 'components.adminSidebar.categories', icon: 'category' },
  { to: '/admin/users', label: 'components.adminSidebar.users', icon: 'group' },
  { to: '/admin/listings', label: 'components.adminSidebar.listings', icon: 'storefront' },
  { to: '/admin/ads', label: 'components.adminSidebar.ads', icon: 'campaign' },
  { to: '/admin/newsletter', label: 'components.adminSidebar.newsletter', icon: 'mail' },
];

/** Left nav for the admin CMS, highlighting the active route. Hidden on mobile (dashboard cards link everywhere). */
export function AdminSidebar() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-gray-50/60 p-6 md:block">
      <p className="font-serif text-lg font-bold text-brand">{t('components.adminSidebar.brand')}</p>
      <p className="text-xs text-gray-500">{t('components.adminSidebar.subtitle')}</p>
      <nav className="mt-8 space-y-1">
        {LINKS.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors ${
                active ? 'bg-brand/10 font-semibold text-brand' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
              {t(link.label)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
