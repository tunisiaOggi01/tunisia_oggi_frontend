import { useTranslation } from 'react-i18next';
import { formatDate } from '../../utils/formatDate';
import type { AdStatus, Advertisement } from '../../api/ads/types';

const STATUS_CLASS: Record<AdStatus, string> = {
  PROGRAMMATA: 'border-amber-300 bg-amber-50 text-amber-700',
  ATTIVA: 'border-green-300 bg-green-50 text-green-700',
  SCADUTA: 'border-gray-300 bg-gray-100 text-gray-500',
};
const STATUS_KEY: Record<AdStatus, string> = {
  PROGRAMMATA: 'admin.ads.statusProgrammata',
  ATTIVA: 'admin.ads.statusAttiva',
  SCADUTA: 'admin.ads.statusScaduta',
};

/** Read-only detail modal for a single ad — shows image, stats, dates, and advertiser info. */
export function AdDetailModal({
  isOpen,
  onClose,
  ad,
  onEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  ad: Advertisement | null;
  onEdit: (ad: Advertisement) => void;
}) {
  const { t, i18n } = useTranslation();
  if (!isOpen || !ad) return null;

  const ctr = ad.impressions > 0 ? `${((ad.clicks / ad.impressions) * 100).toFixed(1)}%` : '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto border border-gray-200 bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold">{ad.title}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <img
          src={ad.imageUrl}
          alt={ad.title}
          className="mb-4 w-full border border-gray-200 object-cover"
          style={{ maxHeight: 200 }}
        />

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <span className={`rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${STATUS_CLASS[ad.status]}`}>
              {t(STATUS_KEY[ad.status])}
            </span>
            <span className="rounded-sm border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-600">
              {ad.placement}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">{t('admin.ads.formStartDate')}</span>
              <span className="text-gray-900">{formatDate(ad.startDate, i18n.language)}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">{t('admin.ads.formEndDate')}</span>
              <span className="text-gray-900">{formatDate(ad.endDate, i18n.language)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">{t('admin.ads.colImpressions')}</span>
              <span className="text-gray-900">{ad.impressions}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">{t('admin.ads.colClicks')}</span>
              <span className="text-gray-900">{ad.clicks}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">CTR</span>
              <span className="text-gray-900">{ctr}</span>
            </div>
          </div>

          {ad.maxImpressions && (
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">{t('admin.ads.colBudget')}</span>
              <span className="text-gray-900">
                {ad.impressions} / {ad.maxImpressions}
                {ad.budgetExhausted && (
                  <span className="ml-2 rounded border border-red-300 bg-red-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-red-700">
                    {t('admin.ads.budgetExhausted')}
                  </span>
                )}
              </span>
            </div>
          )}

          {(ad.advertiserName || ad.advertiserEmail) && (
            <div className="border-t border-gray-100 pt-3">
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Advertiser</span>
              {ad.advertiserName && <span className="text-gray-900">{ad.advertiserName}</span>}
              {ad.advertiserEmail && <span className="ml-2 text-gray-500">{ad.advertiserEmail}</span>}
            </div>
          )}

          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">{t('admin.ads.formLinkUrl')}</span>
            <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="text-brand underline hover:opacity-80">
              {ad.linkUrl}
            </a>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          {ad.status !== 'SCADUTA' && (
            <button
              type="button"
              onClick={() => { onEdit(ad); onClose(); }}
              className="rounded bg-brand px-4 py-2 text-sm text-white hover:opacity-90"
            >
              {t('common.edit')}
            </button>
          )}
          <button type="button" onClick={onClose} className="border border-gray-300 px-4 py-2 text-sm">
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
