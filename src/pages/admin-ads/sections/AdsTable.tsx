import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDeleteAd } from '../../../hooks/ads/mutations/useDeleteAd';
import { formatDate } from '../../../utils/formatDate';
import type { AdStatus, Advertisement } from '../../../api/ads/types';
import type { AdminAdsPage as AdminAdsPageData } from '../../../api/ads/admin.api';

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

/** Ad table: placement, period, derived status, counters, computed CTR, edit + two-step delete. */
export function AdsTable({
  data,
  page,
  setPage,
  onEdit,
  onView,
}: {
  data?: AdminAdsPageData;
  page: number;
  setPage: (p: number) => void;
  onEdit: (ad: Advertisement) => void;
  onView: (ad: Advertisement) => void;
}) {
  const { t, i18n } = useTranslation();
  const remove = useDeleteAd();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 10));
  const cell = 'py-3 pr-4';
  const ctr = (ad: Advertisement) => (ad.impressions > 0 ? `${((ad.clicks / ad.impressions) * 100).toFixed(1)}%` : '—');

  function deleteClicks(id: string) {
    if (confirmingId === id) {
      void remove.mutate(id);
      setConfirmingId(null);
    } else {
      setConfirmingId(id);
    }
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
            <th className={`${cell} pr-4`}>{t('admin.ads.colTitle')}</th>
            <th className={cell}>{t('admin.ads.colPlacement')}</th>
            <th className={cell}>{t('admin.ads.colPeriod')}</th>
            <th className={cell}>{t('admin.ads.colStatus')}</th>
            <th className={cell}>{t('admin.ads.colImpressions')}</th>
             <th className={cell}>{t('admin.ads.colClicks')}</th>
            <th className={cell}>{t('admin.ads.colBudget')}</th>
            <th className={cell}>CTR</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {(data?.data ?? []).map((ad) => (
            <tr key={ad.id} className="border-b border-gray-100 cursor-pointer hover:bg-gray-50" onClick={() => onView(ad)}>
               <td className={`${cell} font-medium`}>{ad.title}</td>
              <td className={cell}>{ad.placement}</td>
              <td className={`${cell} whitespace-nowrap`}>
                {formatDate(ad.startDate, i18n.language)} — {formatDate(ad.endDate, i18n.language)}
              </td>
              <td className={cell}>
                <span className={`rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${STATUS_CLASS[ad.status]}`}>
                  {t(STATUS_KEY[ad.status])}
                </span>
              </td>
               <td className={cell}>{ad.impressions}</td>
              <td className={cell}>{ad.clicks}</td>
              <td className={cell}>
                {ad.maxImpressions ? `${ad.impressions} / ${ad.maxImpressions}` : '—'}
                {ad.budgetExhausted && (
                  <span className="ml-1 rounded border border-red-300 bg-red-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-red-700">
                    {t('admin.ads.budgetExhausted')}
                  </span>
                )}
              </td>
              <td className={cell}>{ctr(ad)}</td>
              <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                {ad.status !== 'SCADUTA' && (
                  <button
                    type="button"
                    onClick={() => onEdit(ad)}
                    className="mr-2 text-xs font-semibold text-brand hover:underline"
                  >
                    {t('common.edit')}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteClicks(ad.id)}
                  className={confirmingId === ad.id ? 'rounded bg-red-600 px-2 py-1 text-xs text-white' : 'text-xs font-semibold text-red-600 hover:underline'}
                >
                  {confirmingId === ad.id ? t('common.confirm') : t('common.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-500">{data?.total ?? 0} ads</span>
        <div className="flex gap-2">
          <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="border border-gray-300 px-3 py-1 text-xs disabled:opacity-40">
            {t('common.previous')}
          </button>
          <button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="border border-gray-300 px-3 py-1 text-xs disabled:opacity-40">
            {t('common.next')}
          </button>
        </div>
      </div>
    </div>
  );
}