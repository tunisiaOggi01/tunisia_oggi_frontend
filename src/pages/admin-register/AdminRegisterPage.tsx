import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { register as registerRequest } from '../../api/auth/auth.api';

/** Account creation — on success redirects to login. */
export function AdminRegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await registerRequest(email, username, password);
      navigate('/admin/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.register.failed'));
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 items-end bg-cover bg-center p-8"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.2)),url('https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=1200')` }}
      >
        <div className="text-white">
          <h2 className="font-serif text-4xl font-bold leading-tight drop-shadow-md">{t('admin.register.heroHeading')}</h2>
          <p className="mt-2 text-lg italic opacity-90 drop-shadow-sm">{t('admin.register.heroSubtitle')}</p>
        </div>
      </div>
      <div className="flex w-full items-center justify-center bg-gray-50 px-4 py-8 md:w-1/2 md:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 h-[3px] w-full rounded-full opacity-60"
            style={{ background: 'linear-gradient(to right, #008C45 33.33%, #F4F5F0 33.33%, #F4F5F0 66.66%, #CD212A 66.66%)' }}
          />
          <div className="mb-8 text-center md:text-left">
            <h1 className="font-serif text-4xl font-bold uppercase tracking-tighter text-brand">{t('admin.register.siteName')}</h1>
            <p className="mt-1 inline-block border-b border-gray-300 pb-4 text-[11px] font-semibold uppercase tracking-widest text-gray-500">{t('admin.register.createAccount')}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="reg-email" className="block text-sm font-semibold text-gray-600">{t('admin.register.emailLabel')}</label>
              <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder={t('admin.register.emailPlaceholder')} required
                className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
            </div>
            <div className="space-y-2">
              <label htmlFor="reg-username" className="block text-sm font-semibold text-gray-600">{t('admin.register.usernameLabel')}</label>
              <input id="reg-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder={t('admin.register.usernamePlaceholder')} required
                className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
            </div>
            <div className="space-y-2">
              <label htmlFor="reg-password" className="block text-sm font-semibold text-gray-600">{t('admin.register.passwordLabel')}</label>
              <div className="relative">
                <input id="reg-password" type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder={t('admin.register.passwordPlaceholder')} required
                  className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand">
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-brand px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-dark active:scale-[0.98]">
              {t('admin.register.submit')}
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">{t('admin.register.hasAccount')}{' '}
              <Link to="/admin/login" className="font-semibold text-brand hover:underline">{t('admin.register.signIn')}</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
