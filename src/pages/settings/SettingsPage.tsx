import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { ProfileSection } from './sections/ProfileSection';
import { AccountSection } from './sections/AccountSection';
import { PasswordSection } from './sections/PasswordSection';

type Tab = 'profile' | 'account' | 'password';

const TABS: { key: Tab; labelKey: string }[] = [
  { key: 'profile', labelKey: 'settings.tabs.profile' },
  { key: 'account', labelKey: 'settings.tabs.account' },
  { key: 'password', labelKey: 'settings.tabs.password' },
];

/** Settings page with tabbed sections for profile, account, and password management. */
export function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <h1 className="mb-2 font-serif text-3xl font-bold uppercase tracking-tighter text-gray-900">
        {t('settings.title')}
      </h1>
      <p className="mb-8 text-sm text-gray-500">{t('settings.subtitle')}</p>

      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-brand text-brand'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === 'profile' && <ProfileSection />}
        {activeTab === 'account' && <AccountSection />}
        {activeTab === 'password' && <PasswordSection />}
      </div>
    </main>
  );
}
