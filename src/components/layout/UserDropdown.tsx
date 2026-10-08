import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';

/** User avatar + dropdown with profile link, settings, language switcher, and logout. */
export function UserDropdown() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return null;

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        {user.imageUrl ? (
          <img src={user.imageUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            {user.username.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="hidden text-sm font-semibold text-gray-700 md:block">{user.username}</span>
        <span className="material-symbols-outlined text-sm text-gray-400">{open ? 'expand_less' : 'expand_more'}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 border border-gray-200 bg-white shadow-lg z-50">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">{user.username}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <Link to="/profile" onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined text-sm">person</span>
            {t('nav.myProfile')}
          </Link>
          <Link to="/my-listings" onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined text-sm">storefront</span>
            {t('nav.myListings')}
          </Link>
          {user.role === 'SUPER_ADMIN' && (
            <Link to="/admin" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-sm">dashboard</span>
              {t('nav.dashboard')}
            </Link>
          )}
          <button onClick={() => { navigate('/settings'); setOpen(false); }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined text-sm">settings</span>
            {t('nav.settings')}
          </button>
          <div className="border-t border-gray-100 px-4 py-2">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">{t('common.language')}</p>
            <LanguageSwitcher className="flex gap-2" itemClassName="flex-1" onSelect={() => setOpen(false)} />
          </div>
          <button onClick={handleLogout}
            className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
            <span className="material-symbols-outlined text-sm">logout</span>
            {t('nav.logout')}
          </button>
        </div>
      )}
    </div>
  );
}
