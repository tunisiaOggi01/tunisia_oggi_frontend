import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useMyListings } from '../../hooks/listings/useMyListings';
import { formatDate } from '../../utils/formatDate';
import type { BusinessListing, ListingStatus } from '../../api/listings/types';

const STATUS_STYLE: Record<ListingStatus, string> = {
  PENDING: 'border-amber-300 bg-amber-50 text-amber-700',
  APPROVED: 'border-green-300 bg-green-50 text-green-700',
  REJECTED: 'border-red-300 bg-red-50 text-red-700',
};

function StatusBadge({ status }: { status: ListingStatus }) {
  const { t } = useTranslation();
  return (
    <span className={`rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLE[status]}`}>
      {t(`myListings.status${status[0]}${status.slice(1).toLowerCase()}`)}
    </span>
  );
}

/** Owner dashboard of submitted business cards, with status badges and view/click counters. */
export function MyListingsPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { data, isLoading } = useMyListings();

  if (!user) {
    return <Navigate to="/admin/login?redirect=/my-listings" replace />;
  }

  const totalClicks = (l: BusinessListing) => l.phoneClicks + l.emailClicks + l.websiteClicks;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <div className="mb-8">
        <div className="mb-4 h-1 w-16 bg-brand" />
        <h1 className="font-display text-headline-lg text-gray-900">{t('myListings.title')}</h1>
        <p className="mt-2 text-body-md text-gray-500">{t('myListings.subtitle')}</p>
      </div>

      {isLoading && <p className="py-16 text-center text-sm text-gray-400">{t('directory.loading')}</p>}

      {!isLoading && data && data.length === 0 && (
        <div className="border border-gray-200 bg-white p-8 text-center">
          <p className="text-body-md text-gray-500">{t('myListings.empty')}</p>
          <p className="mt-1 text-sm text-gray-400">{t('myListings.emptyHint')}</p>
          <Link
            to="/directory/add"
            className="mt-5 inline-block bg-brand px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:brightness-110"
          >
            {t('myListings.addBusiness')}
          </Link>
        </div>
      )}

      {!isLoading && data && data.length > 0 && (
        <ul className="space-y-4">
          {data.map((listing) => (
            <li key={listing.id} className="border border-gray-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-headline text-headline-md text-gray-900">{listing.businessName}</h2>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {t('myListings.submittedOn', { date: formatDate(listing.submittedAt, i18n.language) })}
                  </p>
                </div>
                <StatusBadge status={listing.status} />
              </div>

              <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                <span>{t('myListings.views', { n: listing.views })}</span>
                <span>{t('myListings.clicks', { n: totalClicks(listing) })}</span>
              </div>

              {listing.status === 'PENDING' && <p className="mt-3 text-sm text-amber-600">{t('myListings.pendingHint')}</p>}
              {listing.status === 'REJECTED' && <p className="mt-3 text-sm text-red-600">{t('myListings.rejectedHint')}</p>}
              {listing.status === 'APPROVED' && (
                <Link to={`/directory/${listing.id}`} className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
                  {t('myListings.details')}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}