import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveAds } from '../../hooks/ads/useActiveAds';
import { useAdEvent } from '../../hooks/ads/mutations/useAdEvent';
import { useImpressionOnce } from './useImpressionOnce';
import type { Advertisement, AdPlacement } from '../../api/ads/types';

const VARIANT_CLASS: Record<AdPlacement, string> = {
  SIDEBAR: 'flex flex-col border border-gray-200 bg-white',
  IN_ARTICLE: 'flex flex-col border border-gray-200 bg-white p-4',
  FOOTER: 'flex flex-row items-center gap-4 border border-gray-200 bg-white p-6',
  HOME_STRIP: 'flex flex-col border border-gray-200 bg-white',
};

/** Single ad card rendered inside an AdSlot. */
function AdCard({ ad, placement }: { ad: Advertisement; placement: AdPlacement }) {
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
    <div ref={ref} className={VARIANT_CLASS[placement]}>
      <a href={ad.linkUrl} onClick={handleClick} className="group block">
        <img
          src={ad.imageUrl}
          alt=""
          loading="lazy"
          className={`w-full bg-gray-100 object-cover transition-transform duration-500 group-hover:scale-105 ${
            placement === 'FOOTER' ? 'h-24 w-full shrink-0' : 'aspect-video'
          }`}
        />
        <div className={`p-3 ${placement === 'FOOTER' ? 'min-w-0 flex-1 p-4' : ''}`}>
          <h3 className={`text-gray-900 transition-colors group-hover:text-brand ${
            placement === 'FOOTER' ? 'text-base font-semibold' : 'font-headline text-headline-md'
          }`}>
            {ad.title}
          </h3>
          {ad.advertiserName && (
            <p className="mt-1 text-xs text-gray-500">{ad.advertiserName}</p>
          )}
        </div>
      </a>
    </div>
  );
}

/** Public ad slot (sidebar/footer/in-article/home-strip); renders nothing when no active ad exists. */
export function AdSlot({ placement, limit = 1 }: { placement: AdPlacement; limit?: number }) {
  const { t } = useTranslation();
  const { data } = useActiveAds(placement, limit);
  const ads = data ?? [];

  if (ads.length === 0) return null;

  return (
    <>
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {t('ads.label')}
      </p>
      {ads.length === 1 ? (
        <AdCard ad={ads[0]} placement={placement} />
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} placement={placement} />
          ))}
        </div>
      )}
    </>
  );
}
