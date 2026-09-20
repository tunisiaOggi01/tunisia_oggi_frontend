import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
/** Split-screen admin login: hero image on left, Google OAuth + email/password on right. */
export function AdminLoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const redirect = searchParams.get('redirect');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const u = await login(email, password);
      if (!u.profileCompleted) {
        navigate('/admin/complete-profile');
      } else {
        navigate(redirect || (u.role === 'SUPER_ADMIN' ? '/admin' : '/'));
      }
    } catch {
      setError(t('admin.login.invalidCredentials'));
    }
  }

  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      <div
        className="hidden md:flex md:w-1/2 items-end bg-cover bg-center p-8"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.2)),url('https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=1200')`,
        }}
      >
        <div className="text-white">
          <h2 className="font-serif text-4xl font-bold leading-tight drop-shadow-md">
            {t('admin.login.heroHeading')}
          </h2>
          <p className="mt-2 text-lg italic opacity-90 drop-shadow-sm">
            {t('admin.login.heroSubtitle')}
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-gray-50 px-4 py-8 md:w-1/2 md:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 h-[3px] w-full rounded-full opacity-60"
            style={{ background: 'linear-gradient(to right, #008C45 33.33%, #F4F5F0 33.33%, #F4F5F0 66.66%, #CD212A 66.66%)' }}
          />

          <div className="mb-8 text-center md:text-left">
            <h1 className="font-serif text-4xl font-bold uppercase tracking-tighter text-brand">
              {t('admin.login.siteName')}
            </h1>
            <p className="mt-1 inline-block border-b border-gray-300 pb-4 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              {t('admin.login.adminAccess')}
            </p>
          </div>

          <div className="space-y-6">
            <a
              href={`${apiUrl}/auth/google${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className="flex w-full items-center justify-center gap-3 rounded-sm border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-600 shadow-sm transition-all hover:bg-gray-50"
            >
              <svg height="18" viewBox="0 0 24 24" width="18">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {t('admin.login.continueWithGoogle')}
            </a>

            <div className="flex items-center py-2">
              <div className="flex-grow border-t border-gray-300" />
              <span className="mx-4 flex-shrink text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                {t('admin.login.orEmail')}
              </span>
              <div className="flex-grow border-t border-gray-300" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-600">
                  {t('admin.login.emailLabel')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('admin.login.emailPlaceholder')}
                  className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-600">
                    {t('admin.login.passwordLabel')}
                  </label>
                  <Link to="/admin/forgot-password" className="text-xs text-brand hover:underline">
                    {t('admin.login.forgot')}
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('admin.login.passwordPlaceholder')}
                    className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded-sm border-gray-300 text-brand focus:ring-brand"
                />
                <label htmlFor="remember-me" className="ml-2 cursor-pointer text-xs text-gray-500">
                  {t('admin.login.rememberMe')}
                </label>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-brand px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-dark active:scale-[0.98]"
              >
                {t('admin.login.secureLogin')}
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </form>

            <div className="flex flex-col items-center gap-4 pt-6">
              <Link
                to="/"
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-brand"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                {t('admin.login.returnToSite')}
              </Link>
              <Link
                to="/admin/register"
                className="flex items-center gap-2 text-xs font-semibold text-gray-400 transition-colors hover:text-brand"
              >
                {t('admin.login.noAccount')} <span className="text-brand">{t('admin.login.createOne')}</span>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 pt-8 text-gray-300">
              <span className="material-symbols-outlined text-[14px]">encrypted</span>
              <p className="text-[11px]">{t('admin.login.securityFooter')}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
