import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useListings } from '../../hooks/listings/useListings';
import type { BusinessCategory } from '../../api/listings/types';

const SERVICES_COUNT = 3;

const CATEGORY_ICON: Record<BusinessCategory, string> = {
  RESTAURANT: 'restaurant',
  LAW: 'gavel',
  REAL_ESTATE: 'real_estate_agent',
  HEALTH: 'health_and_safety',
  SERVICES: 'handyman',
};

const CATEGORY_KEY: Record<BusinessCategory, string> = {
  RESTAURANT: 'directory.categories.restaurant',
  LAW: 'directory.categories.law',
  REAL_ESTATE: 'directory.categories.realEstate',
  HEALTH: 'directory.categories.health',
  SERVICES: 'directory.categories.services',
};

/** Sidebar widget: up to 3 approved annuario entries (icon, category, name) with a link to the full directory. Renders nothing while loading or when empty. */
export function ServicesList() {
  const { t } = useTranslation();
  const { data: listings } = useListings({});

  if (!listings || listings.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-brand">
          {t('home.directorySection.heading')}
        </h4>
        <Link
          to="/directory"
          className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 transition-colors hover:text-brand"
        >
          {t('home.directorySection.viewAll')}
        </Link>
      </div>
      <div className="space-y-3">
        {listings.slice(0, SERVICES_COUNT).map((listing) => (
          <Link
            key={listing.id}
            to={`/directory/${listing.id}`}
            className="group flex items-center gap-3 border border-gray-200 bg-white p-3 transition-colors hover:border-brand"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-gray-200 bg-gray-50 text-brand transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
              <span className="material-symbols-outlined text-[20px]">{CATEGORY_ICON[listing.category]}</span>
            </span>
            <span className="min-w-0 flex-1">
              <span
                className="block truncate text-sm font-semibold text-gray-800 transition-colors group-hover:text-brand"
                title={listing.businessName}
              >
                {listing.businessName}
              </span>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {t(CATEGORY_KEY[listing.category])}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}