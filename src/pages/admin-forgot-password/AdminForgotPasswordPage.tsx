import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { forgotPassword } from '../../api/auth/auth.api';

/** Email entry page for the password-reset flow. Sends OTP, navigates to reset page. */
export function AdminForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await forgotPassword(email);
      // Pass email (and the dev-mode code if available) to the reset page via state
      navigate('/admin/reset-password', { state: { email, code: result.code } });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.forgotPassword.failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 items-end bg-cover bg-center p-8"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.2)),url('https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=1200')` }}
      >
        <div className="text-white">
          <h2 className="font-serif text-4xl font-bold leading-tight drop-shadow-md">{t('admin.forgotPassword.heroHeading')}</h2>
          <p className="mt-2 text-lg italic opacity-90 drop-shadow-sm">{t('admin.forgotPassword.heroSubtitle')}</p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-gray-50 px-4 py-8 md:w-1/2 md:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 h-[3px] w-full rounded-full opacity-60"
            style={{ background: 'linear-gradient(to right, #008C45 33.33%, #F4F5F0 33.33%, #F4F5F0 66.66%, #CD212A 66.66%)' }}
          />
          <div className="mb-8 text-center md:text-left">
            <h1 className="font-serif text-4xl font-bold uppercase tracking-tighter text-brand">{t('nav.logo')}</h1>
            <p className="mt-1 inline-block border-b border-gray-300 pb-4 text-[11px] font-semibold uppercase tracking-widest text-gray-500">{t('admin.forgotPassword.pageTitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-sm text-gray-500">{t('admin.forgotPassword.instructions')}</p>

            <div className="space-y-2">
              <label htmlFor="fp-email" className="block text-sm font-semibold text-gray-600">{t('admin.forgotPassword.emailLabel')}</label>
              <input id="fp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder={t('admin.forgotPassword.emailPlaceholder')} required
                className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-brand px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-dark disabled:opacity-60 active:scale-[0.98]">
              {loading ? t('admin.forgotPassword.sending') : t('admin.forgotPassword.submit')}
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/admin/login" className="flex items-center justify-center gap-1 text-xs font-semibold text-gray-500 hover:text-brand">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              {t('admin.forgotPassword.backToLogin')}
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 pt-4 text-gray-300">
            <span className="material-symbols-outlined text-[14px]">encrypted</span>
            <p className="text-[11px]">{t('admin.forgotPassword.securityFooter')}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
