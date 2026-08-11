import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { BusinessListing, BusinessCategory } from '../../api/listings/types';

const CATEGORY_KEY: Record<BusinessCategory, string> = {
  RESTAURANT: 'directory.categories.restaurant',
  LAW: 'directory.categories.law',
  REAL_ESTATE: 'directory.categories.realEstate',
  HEALTH: 'directory.categories.health',
  SERVICES: 'directory.categories.services',
};

/** Directory card (screen-8): name, category chip, description and contact line; links to the detail page. */
export function ListingCard({ listing }: { listing: BusinessListing }) {
  const { t } = useTranslation();
  return (
    <Link
      to={`/directory/${listing.id}`}
      className="group flex flex-col border border-gray-200 bg-white p-5 transition-colors hover:border-brand"
    >
      <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-brand">
        {t(CATEGORY_KEY[listing.category])}
      </span>
      <h3 className="font-headline text-headline-md text-gray-900 transition-colors group-hover:text-brand">
        {listing.businessName}
      </h3>
      {listing.description && (
        <p className="mt-1 line-clamp-3 text-body-md text-gray-500">{listing.description}</p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-gray-100 pt-3 text-caption text-gray-500">
        <span>{listing.phone}</span>
        <span aria-hidden="true">&bull;</span>
        <span>{listing.email}</span>
      </div>
    </Link>
  );
}