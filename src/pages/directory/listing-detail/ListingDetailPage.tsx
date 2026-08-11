import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useListingDetail } from '../../../hooks/listings/useListingDetail';
import { useTrackListingClick } from '../../../hooks/listings/mutations/useTrackListingClick';
import type { ListingAction } from '../../../api/listings/types';

/** Public listing detail page: fires a click metric before the user leaves for a contact channel. */
export function ListingDetailPage() {
  const { id = '' } = useParams();
  const { t } = useTranslation();
  const { data, isLoading, isError } = useListingDetail(id);
  const track = useTrackListingClick();

  if (isLoading) {
    return <main className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-gray-400">{t('directory.loading')}</main>;
  }

  if (isError || !data) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-headline-md text-gray-900">{t('listingDetail.notFound')}</h1>
        <Link to="/directory" className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">
          {t('listingDetail.backToDirectory')}
        </Link>
      </main>
    );
  }

  const listing = data;
  const website = listing.website;
  function openChannel(action: ListingAction, url: string) {
    void track.mutate({ id: listing.id, action });
    window.open(url, '_blank', 'noopener');
  }

  const contactClass =
    'inline-flex items-center gap-2 border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-brand hover:text-brand';

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <Link to="/directory" className="text-sm font-semibold text-brand hover:underline">
        &larr;&nbsp;{t('listingDetail.backToDirectory')}
      </Link>

      <div className="mt-6 border border-gray-200 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand">
              {t(`directory.categories.${listing.category.toLowerCase()}`)}
            </p>
            <h1 className="mt-2 font-display text-headline-lg text-gray-900">{listing.businessName}</h1>
            <p className="mt-1 text-sm text-gray-400">{t('listingDetail.views', { n: listing.views })}</p>
          </div>
        </div>

        {listing.description && (
          <p className="mt-6 whitespace-pre-line text-body-md text-gray-600">{listing.description}</p>
        )}

        <div className="mt-8 border-t border-gray-100 pt-6">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">{t('listingDetail.contact')}</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${listing.phone}`}
              onClick={() => openChannel('PHONE', `tel:${listing.phone}`)}
              className={contactClass}
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              {listing.phone}
            </a>
            <a
              href={`mailto:${listing.email}`}
              onClick={() => openChannel('EMAIL', `mailto:${listing.email}`)}
              className={contactClass}
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
              {t('listingDetail.emailBtn')}
            </a>
            {website && (
              <a
                href={website}
                onClick={() => openChannel('WEBSITE', website)}
                className={contactClass}
              >
                <span className="material-symbols-outlined text-[18px]">language</span>
                {t('listingDetail.websiteBtn')}
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}