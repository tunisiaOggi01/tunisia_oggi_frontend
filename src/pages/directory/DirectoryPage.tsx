import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useListings } from '../../hooks/listings/useListings';
import { ListingCard } from '../../components/listings/ListingCard';
import { PageMeta } from '../../components/seo/PageMeta';
import type { BusinessCategory } from '../../api/listings/types';

const CATEGORY_FILTERS: BusinessCategory[] = [
  'RESTAURANT',
  'LAW',
  'REAL_ESTATE',
  'HEALTH',
  'SERVICES',
];

/** Public business directory: server-side category chips over a grid of approved listing cards. */
export function DirectoryPage() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<BusinessCategory | undefined>(undefined);
  const { data, isLoading } = useListings({ category });

  const chipClass = (active: boolean) =>
    `rounded-sm border px-3 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
      active ? 'border-brand bg-brand text-white' : 'border-gray-300 text-gray-600 hover:border-brand hover:text-brand'
    }`;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <PageMeta title={t('directory.seoTitle')} description={t('directory.seoDescription')} />
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-4 h-1 w-16 bg-brand" />
          <h1 className="font-display text-headline-lg text-gray-900">{t('directory.title')}</h1>
          <p className="mt-2 text-body-md text-gray-500">{t('directory.subtitle')}</p>
        </div>
        <Link
          to="/directory/add"
          className="inline-flex items-center gap-2 bg-brand px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:brightness-110"
        >
          <span className="material-symbols-outlined text-[16px]">add_business</span>
          {t('directory.addBusiness')}
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => setCategory(undefined)} className={chipClass(!category)}>
          {t('directory.categories.all')}
        </button>
        {CATEGORY_FILTERS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c === category ? undefined : c)}
            className={chipClass(c === category)}
          >
            {t(`directory.categories.${c.toLowerCase()}`)}
          </button>
        ))}
      </div>

      {isLoading && <p className="py-16 text-center text-sm text-gray-400">{t('directory.loading')}</p>}

      {!isLoading && data && data.length === 0 && (
        <p className="py-16 text-center text-body-md text-gray-500">{t('directory.empty')}</p>
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}