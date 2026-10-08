import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { SearchPopup } from './search/SearchPopup';
import { UserDropdown } from './UserDropdown';
import { LanguageSwitcher } from './LanguageSwitcher';

const CATEGORIES_KEYS = ['national', 'politics', 'community', 'culture', 'economy'] as const;

/** Top navigation: logo, centered categories, search icon, user dropdown. */
export function Navbar() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="font-serif text-2xl font-bold uppercase tracking-tighter text-brand shrink-0">
          {t('nav.logo')}
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {CATEGORIES_KEYS.map((key) => {
            const slug = key;
            const isActive = pathname === `/category/${slug}`;
            return (
              <Link key={key} to={`/category/${slug}`}
                className={`border-b-2 pb-1 text-sm transition-colors duration-200 ${
                  isActive ? 'border-brand font-bold text-brand' : 'border-transparent text-gray-600 hover:border-brand hover:text-brand'
                }`}
              >
                {t(`nav.categories.${key}`)}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 shrink-0">
          <SearchPopup />
          {!user && <Link to="/admin/login?redirect=/"
            className="hidden items-center gap-1 border border-brand px-3 py-2.5 h-[34px] text-xs font-semibold text-brand transition-all hover:bg-brand hover:text-white active:scale-95 md:flex"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            {t('nav.createArticle')}
          </Link>}
          {user && <Link
            to="/directory"
            className={`hidden items-center gap-1 px-3 py-2.5 h-[34px] text-xs font-semibold text-white transition-all active:scale-95 md:flex ${
              pathname.startsWith('/directory')
                ? 'bg-brand'
                : 'bg-brand hover:opacity-90'
            }`}
          >
            {t('nav.directory')}
          </Link>}
          {user ? <UserDropdown /> : (
            <>
              <LanguageSwitcher />
              <div className="flex items-center gap-2">
                <Link to="/admin/register"
                  className="border border-brand px-3 py-2.5 h-[34px] text-xs font-semibold text-brand transition-all hover:bg-brand hover:text-white active:scale-95"
                >{t('nav.signup')}</Link>
                <Link to="/admin/login"
                  className="bg-brand px-4 py-2.5 h-[34px] text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                >{t('nav.login')}</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
