import { useState } from 'react';
import { updateHeardAbout } from '../../api/auth/auth.api';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const SOURCES = ['Social Media', 'Friend or Colleague', 'Google Search', 'Advertisement', 'News Article', 'Other'] as const;

const SOURCE_KEYS: Record<string, string> = {
  'Social Media': 'components.heardAbout.socialMedia',
  'Friend or Colleague': 'components.heardAbout.friendOrColleague',
  'Google Search': 'components.heardAbout.googleSearch',
  'Advertisement': 'components.heardAbout.advertisement',
  'News Article': 'components.heardAbout.newsArticle',
  'Other': 'components.heardAbout.other',
};

/** First-login modal: asks how the user heard about Tunisia Oggi. */
export function HeardAboutModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { refreshUser } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!selected) return;
    setSaving(true);
    try {
      await updateHeardAbout(selected);
      await refreshUser();
      onClose();
    } catch {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-sm bg-white p-8 shadow-xl">
        <h2 className="font-serif text-xl font-bold text-gray-800">{t('components.heardAbout.heading')}</h2>
        <p className="mt-2 text-sm text-gray-500">{t('components.heardAbout.question')}</p>
        <div className="mt-6 space-y-3">
          {SOURCES.map((s) => (
            <button key={s} onClick={() => setSelected(s)}
              className={`flex w-full items-center rounded-sm border px-4 py-3 text-sm font-medium transition-all ${
                selected === s ? 'border-brand bg-brand/5 text-brand' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                selected === s ? 'border-brand bg-brand' : 'border-gray-300'
              }`}>
                {selected === s && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>
              {t(SOURCE_KEYS[s])}
            </button>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-sm border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50">
            {t('components.heardAbout.skip')}
          </button>
          <button onClick={handleSubmit} disabled={!selected || saving}
            className="flex-1 rounded-sm bg-brand px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark disabled:opacity-60">
            {saving ? t('components.heardAbout.saving') : t('components.heardAbout.submit')}
          </button>
        </div>
      </div>
    </div>
  );
}
