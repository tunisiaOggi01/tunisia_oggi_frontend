import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/** 404 page shown when no route matches. */
export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="font-serif text-[120px] font-bold leading-none text-brand opacity-20">{t('notFound.title')}</span>
      <h1 className="mt-4 font-serif text-2xl font-bold text-gray-900">{t('notFound.heading')}</h1>
      <p className="mt-2 max-w-md text-sm text-gray-500">{t('notFound.description')}</p>
      <Link to="/"
        className="mt-8 rounded bg-brand px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95">
        {t('notFound.backHome')}
      </Link>
    </div>
  );
}
