import { useTranslation } from 'react-i18next';
import { NewsletterForm } from '../../components/newsletter/NewsletterForm';

/** Newsletter signup card (light skin) for the homepage sidebar — functional since Sprint 2. */
export function NewsletterBox() {
  const { t } = useTranslation();
  return (
    <div className="border border-gray-200 bg-gray-50 p-6">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-brand">{t('components.newsletter.heading')}</h4>
      <p className="mt-2 text-sm text-gray-600">{t('components.newsletter.description')}</p>
      <div className="mt-4">
        <NewsletterForm variant="light" />
      </div>
    </div>
  );
}