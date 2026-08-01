import { useTranslation } from 'react-i18next';

/** Presentational-only newsletter signup card — not wired to a backend (Sprint 2 scope). */
export function NewsletterBox() {
  const { t } = useTranslation();
  return (
    <div className="border border-gray-200 bg-gray-50 p-6">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-brand">{t('components.newsletter.heading')}</h4>
      <p className="mt-2 text-sm text-gray-600">
        {t('components.newsletter.description')}
      </p>
      <form className="mt-4 space-y-3">
        <input
          type="email"
          placeholder={t('components.newsletter.emailPlaceholder')}
          disabled
          className="w-full border border-gray-300 bg-white p-3 text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10"
        />
        <button
          type="button"
          disabled
          title={t('components.newsletter.notAvailable')}
          className="w-full bg-brand px-4 py-3 text-xs font-semibold tracking-wider text-white opacity-60 transition-all"
        >
          {t('components.newsletter.subscribe')}
        </button>
      </form>
    </div>
  );
}
