import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveAds } from '../../hooks/ads/useActiveAds';
import { useAdEvent } from '../../hooks/ads/mutations/useAdEvent';
import { useImpressionOnce } from './useImpressionOnce';
import type { AdPlacement } from '../../api/ads/types';

const VARIANT_CLASS: Record<AdPlacement, string> = {
  SIDEBAR: 'flex flex-col border border-gray-200 bg-white',
  IN_ARTICLE: 'flex flex-col border border-gray-200 bg-white p-4',
  FOOTER: 'flex flex-row items-center gap-4 border border-gray-200 bg-white p-4',
  HOME_STRIP: 'flex flex-col border border-gray-200 bg-white',
};

/** Single-ad public slot (sidebar/footer/in-article variants); renders nothing when no active ad exists. */
export function AdSlot({ placement }: { placement: AdPlacement }) {
  const { t } = useTranslation();
  const { data } = useActiveAds(placement, 1);
  const track = useAdEvent();
  const ref = useRef<HTMLDivElement>(null);
  const ad = data?.[0];
  useImpressionOnce(ref, () => {
    if (ad) void track.mutate({ id: ad.id, event: 'impression' });
  });

  if (!ad) return null;

  const current = ad;
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    void track.mutate({ id: current.id, event: 'click' });
    window.open(current.linkUrl, '_blank', 'noopener');
  }

  return (
    <div ref={ref} className={VARIANT_CLASS[placement]}>
      <p className="px-2 pt-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {t('ads.label')}
      </p>
      <a href={ad.linkUrl} onClick={handleClick} className="group block">
        <img
          src={ad.imageUrl}
          alt=""
          loading="lazy"
          className={`w-full bg-gray-100 object-cover transition-transform duration-500 group-hover:scale-105 ${
            placement === 'FOOTER' ? 'h-24 w-40 shrink-0' : 'aspect-video'
          }`}
        />
        <div className="p-3">
          <h3 className="font-headline text-headline-md text-gray-900 transition-colors group-hover:text-brand">
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