import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveAds } from '../../hooks/ads/useActiveAds';
import { useAdEvent } from '../../hooks/ads/mutations/useAdEvent';
import { useImpressionOnce } from './useImpressionOnce';
import type { Advertisement } from '../../api/ads/types';

function StripCard({ ad }: { ad: Advertisement }) {
  const { t } = useTranslation();
  const track = useAdEvent();
  const ref = useRef<HTMLDivElement>(null);
  useImpressionOnce(ref, ad.id, () => {
    void track.mutate({ id: ad.id, event: 'impression' });
  });

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    void track.mutate({ id: ad.id, event: 'click' });
    window.open(ad.linkUrl, '_blank', 'noopener');
  }

  return (
    <div
      ref={ref}
      className="flex items-center gap-4 border border-gray-200 bg-white p-3"
    >
      <img src={ad.imageUrl} alt="" loading="lazy" className="h-16 w-28 shrink-0 bg-gray-100 object-cover" />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{t('ads.label')}</p>
        <a
          href={ad.linkUrl}
          onClick={handleClick}
          className="block truncate font-headline text-headline-md text-gray-900 transition-colors hover:text-brand"
        >
          {ad.title}
        </a>
        {ad.advertiserName && <p className="truncate text-xs text-gray-500">{ad.advertiserName}</p>}
      </div>
    </div>
  );
}

/** Homepage strip below the hero: up to 3 HOME_STRIP ads, each tracked individually. */
export function AdStrip() {
  const { t } = useTranslation();
  const { data } = useActiveAds('HOME_STRIP', 3);

  if (!data || data.length === 0) return null;

  return (
    <section className="mb-8">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">{t('ads.promoted')}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {data.map((ad) => (
          <StripCard key={ad.id} ad={ad} />
        ))}
      </div>
    </section>
  );
}