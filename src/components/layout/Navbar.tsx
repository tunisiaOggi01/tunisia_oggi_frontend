import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { SearchPopup } from './search/SearchPopup';
import { UserDropdown } from './UserDropdown';
import { LanguageSwitcher } from './LanguageSwitcher';

const CATEGORIES_KEYS = ['national', 'politics', 'community', 'culture', 'economy'] as const;

/** Top navigation: logo, centered categories, search icon, user dropdown; collapses into a menu panel on mobile. */
export function Navbar() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile panel whenever the user navigates.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 md:px-6">
        <Link to="/" className="font-serif text-xl font-bold uppercase tracking-tighter text-brand shrink-0 md:text-2xl">
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
        <div className="flex items-center gap-2 shrink-0 md:gap-3">
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
              <LanguageSwitcher className="hidden md:block" />
              <div className="flex items-center gap-2">
                <Link to="/admin/register"
                  className="hidden border border-brand px-3 py-2.5 h-[34px] text-xs font-semibold text-brand transition-all hover:bg-brand hover:text-white active:scale-95 md:block"
                >{t('nav.signup')}</Link>
                <Link to="/admin/login"
                  className="bg-brand px-4 py-2.5 h-[34px] text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                >{t('nav.login')}</Link>
              </div>
            </>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label="Menu"
            className="material-symbols-outlined flex h-[34px] w-[34px] items-center justify-center text-[24px] text-gray-700 transition-colors hover:text-brand md:hidden"
          >
            {menuOpen ? 'close' : 'menu'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 pb-6 pt-2 shadow-lg md:hidden">
          <nav className="flex flex-col">
            {CATEGORIES_KEYS.map((key) => {
              const isActive = pathname === `/category/${key}`;
              return (
                <Link key={key} to={`/category/${key}`}
                  className={`border-b border-gray-100 py-3 text-sm transition-colors ${
                    isActive ? 'font-bold text-brand' : 'text-gray-700 hover:text-brand'
                  }`}
                >
                  {t(`nav.categories.${key}`)}
                </Link>
              );
            })}
            {user && (
              <Link to="/directory" className="border-b border-gray-100 py-3 text-sm font-semibold text-brand">
                {t('nav.directory')}
              </Link>
            )}
          </nav>
          {!user && (
            <div className="mt-4 space-y-3">
              <LanguageSwitcher className="w-full" />
              <div className="grid grid-cols-2 gap-2">
                <Link to="/admin/login?redirect=/"
                  className="flex h-[38px] items-center justify-center gap-1 border border-brand text-xs font-semibold text-brand"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  {t('nav.createArticle')}
                </Link>
                <Link to="/admin/register"
                  className="flex h-[38px] items-center justify-center border border-brand text-xs font-semibold text-brand"
                >{t('nav.signup')}</Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
