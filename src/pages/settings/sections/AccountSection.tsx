import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useChangeUsername } from '../../../hooks/settings/useSettingsMutations';

/** Account settings: username and email management. */
export function AccountSection() {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const [username, setUsername] = useState(user?.username ?? '');
  const email = user?.email ?? '';
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const usernameMut = useChangeUsername();

  async function handleSave() {
    setError(null);
    setSaved(false);
    try {
      if (username !== user?.username) await usernameMut.mutateAsync(username);
      await refreshUser();
      setSaved(true);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t('settings.account.error'));
    }
  }

  const isPending = usernameMut.isPending;
  const changed = username !== user?.username;

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">{t('settings.account.username')}</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">{t('settings.account.email')}</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full rounded-sm border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isPending || !changed}
          className="rounded-sm bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-dark disabled:opacity-60"
        >
          {isPending ? t('settings.account.saving') : t('settings.account.save')}
        </button>
        {saved && <span className="text-sm text-green-600">{t('settings.account.saved')}</span>}
      </div>
    </div>
  );
}
