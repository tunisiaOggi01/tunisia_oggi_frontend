import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { useAdminAds } from '../../hooks/ads/useAdminAds';
import { useAdsStats } from '../../hooks/ads/useAdsStats';
import { AdsStatsRow } from './sections/AdsStatsRow';
import { AdsTable } from './sections/AdsTable';
import { CreateAdModal } from './CreateAdModal';
import type { AdPlacement } from '../../api/ads/types';

/** Admin screen-12: ads manager — stats, placement filter, table with derived status, create modal. */
export function AdminAdsPage() {
  const { t } = useTranslation();
  const [placement, setPlacement] = useState<AdPlacement | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data } = useAdminAds(placement, page);
  const { data: stats } = useAdsStats();

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">{t('admin.ads.pageTitle')}</h1>
            <p className="mt-1 text-sm text-gray-500">{t('admin.ads.pageSubtitle')}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="rounded bg-brand px-4 py-2 text-sm text-white hover:opacity-90"
          >
            {t('admin.ads.newAd')}
          </button>
        </div>

        <AdsStatsRow stats={stats} />

        <div className="mt-6 flex items-center gap-3">
          <select
            value={placement ?? ''}
            onChange={(e) => {
              setPlacement((e.target.value || undefined) as AdPlacement | undefined);
              setPage(1);
            }}
            className="border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          >
            <option value="">{t('admin.ads.allPlacements')}</option>
            <option value="SIDEBAR">SIDEBAR</option>
            <option value="IN_ARTICLE">IN_ARTICLE</option>
            <option value="FOOTER">FOOTER</option>
            <option value="HOME_STRIP">HOME_STRIP</option>
          </select>
        </div>

        <AdsTable data={data} page={page} setPage={setPage} />
      </div>

      <CreateAdModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}