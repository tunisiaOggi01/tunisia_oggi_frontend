import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { resetPassword } from '../../api/auth/auth.api';

/** OTP + new-password form: verifies the reset code and sets a new password. */
export function AdminResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [otpCode, setOtpCode] = useState(state?.code ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const email = state?.email as string | undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) { setError(t('admin.resetPassword.validationMinLength')); return; }
    if (newPassword !== confirmPassword) { setError(t('admin.resetPassword.validationMismatch')); return; }
    if (!email) { setError(t('admin.resetPassword.validationExpired')); return; }

    setLoading(true);
    try {
      await resetPassword(email, otpCode, newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.resetPassword.failed'));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
          <h2 className="mt-4 font-serif text-2xl font-bold text-gray-800">{t('admin.resetPassword.successHeading')}</h2>
          <p className="mt-2 text-sm text-gray-500">{t('admin.resetPassword.successText')}</p>
        </div>
      </main>
    );
  }

  if (!email) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-5xl text-amber-500">info</span>
          <h2 className="mt-4 font-serif text-2xl font-bold text-gray-800">{t('admin.resetPassword.invalidSession')}</h2>
          <p className="mt-2 text-sm text-gray-500">{t('admin.resetPassword.invalidSessionText')}</p>
          <Link to="/admin/forgot-password" className="mt-6 inline-block rounded-sm bg-brand px-6 py-3 text-sm font-semibold text-white">{t('admin.resetPassword.tryAgain')}</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 items-end bg-cover bg-center p-8"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.2)),url('https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=1200')` }}
      >
        <div className="text-white">
          <h2 className="font-serif text-4xl font-bold leading-tight drop-shadow-md">{t('admin.resetPassword.heroHeading')}</h2>
          <p className="mt-2 text-lg italic opacity-90 drop-shadow-sm">{t('admin.resetPassword.heroSubtitle')}</p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-gray-50 px-4 py-8 md:w-1/2 md:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 h-[3px] w-full rounded-full opacity-60"
            style={{ background: 'linear-gradient(to right, #008C45 33.33%, #F4F5F0 33.33%, #F4F5F0 66.66%, #CD212A 66.66%)' }}
          />
          <div className="mb-8 text-center md:text-left">
            <h1 className="font-serif text-4xl font-bold uppercase tracking-tighter text-brand">Tunisia Oggi</h1>
            <p className="mt-1 inline-block border-b border-gray-300 pb-4 text-[11px] font-semibold uppercase tracking-widest text-gray-500">{t('admin.resetPassword.pageTitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-xs text-gray-500">{t('admin.resetPassword.instructions', { email: email || '' })}</p>

            <div className="space-y-2">
              <label htmlFor="rp-otp" className="block text-sm font-semibold text-gray-600">{t('admin.resetPassword.otpLabel')}</label>
              <input id="rp-otp" type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                placeholder={t('admin.resetPassword.otpPlaceholder')} maxLength={6} required
                className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3.5 text-center text-lg font-bold tracking-widest text-gray-900 transition-all placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
            </div>

            <div className="space-y-2">
              <label htmlFor="rp-password" className="block text-sm font-semibold text-gray-600">{t('admin.resetPassword.newPasswordLabel')}</label>
              <div className="relative">
                <input id="rp-password" type={showPassword ? 'text' : 'password'} value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} placeholder={t('admin.resetPassword.passwordPlaceholder')} required
                  className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand">
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="rp-confirm" className="block text-sm font-semibold text-gray-600">{t('admin.resetPassword.confirmPasswordLabel')}</label>
              <input id="rp-confirm" type="password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t('admin.resetPassword.passwordPlaceholder')} required
                className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-brand px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-dark disabled:opacity-60 active:scale-[0.98]">
              {loading ? t('admin.resetPassword.resetting') : t('admin.resetPassword.submit')}
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/admin/forgot-password" className="text-xs font-semibold text-gray-500 hover:text-brand">{t('admin.resetPassword.resend')}</Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 pt-4 text-gray-300">
            <span className="material-symbols-outlined text-[14px]">encrypted</span>
            <p className="text-[11px]">{t('admin.resetPassword.securityFooter')}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
