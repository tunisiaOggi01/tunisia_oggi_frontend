import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChangePassword } from '../../../hooks/settings/useSettingsMutations';

/** Password settings: change password with current password verification. */
export function PasswordSection() {
  const { t } = useTranslation();
  const changePassword = useChangePassword();
  const [current, setCurrent] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setError(null);
    setSaved(false);
    if (newPassword !== confirm) {
      setError(t('settings.password.mismatch'));
      return;
    }
    try {
      await changePassword.mutateAsync({ currentPassword: current, newPassword });
      setCurrent('');
      setNewPassword('');
      setConfirm('');
      setSaved(true);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t('settings.password.error'));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">{t('settings.password.current')}</label>
        <input
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">{t('settings.password.new')}</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">{t('settings.password.confirm')}</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={changePassword.isPending || !current || !newPassword || !confirm}
          className="rounded-sm bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-dark disabled:opacity-60"
        >
          {changePassword.isPending ? t('settings.password.saving') : t('settings.password.save')}
        </button>
        {saved && <span className="text-sm text-green-600">{t('settings.password.saved')}</span>}
      </div>
    </div>
  );
}
