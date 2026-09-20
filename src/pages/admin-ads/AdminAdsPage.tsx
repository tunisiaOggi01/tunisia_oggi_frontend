import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { useAdminAds } from '../../hooks/ads/useAdminAds';
import { useAdsStats } from '../../hooks/ads/useAdsStats';
import { AdsStatsRow } from './sections/AdsStatsRow';
import { AdsTable } from './sections/AdsTable';
import { AdLogsTable } from './sections/AdLogsTable';
import { CreateAdModal } from './CreateAdModal';
import { EditAdModal } from './EditAdModal';
import { AdDetailModal } from './AdDetailModal';
import type { AdPlacement, Advertisement } from '../../api/ads/types';

/** Admin screen-12: ads manager — stats, placement filter, table with derived status, create modal. */
export function AdminAdsPage() {
  const { t } = useTranslation();
  const [placement, setPlacement] = useState<AdPlacement | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [viewingAd, setViewingAd] = useState<Advertisement | null>(null);
  const [activeTab, setActiveTab] = useState<'ads' | 'logs'>('ads');

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
          {activeTab === 'ads' && (
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="rounded bg-brand px-4 py-2 text-sm text-white hover:opacity-90"
            >
              {t('admin.ads.newAd')}
            </button>
          )}
        </div>

        <AdsStatsRow stats={stats} />

        <div className="mt-6 flex items-center gap-4 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('ads')}
            className={`pb-2 text-sm font-semibold ${activeTab === 'ads' ? 'border-b-2 border-brand text-brand' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t('admin.ads.tabAds')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`pb-2 text-sm font-semibold ${activeTab === 'logs' ? 'border-b-2 border-brand text-brand' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t('admin.ads.tabLogs')}
          </button>
        </div>

        {activeTab === 'ads' && (
          <>
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
            <AdsTable data={data} page={page} setPage={setPage} onEdit={setEditingAd} onView={setViewingAd} />
          </>
        )}

        {activeTab === 'logs' && <AdLogsTable />}
      </div>

      <CreateAdModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <EditAdModal isOpen={editingAd !== null} onClose={() => setEditingAd(null)} ad={editingAd} />
      <AdDetailModal
        isOpen={viewingAd !== null}
        onClose={() => setViewingAd(null)}
        ad={viewingAd}
        onEdit={(ad) => { setViewingAd(null); setEditingAd(ad); }}
      />
    </div>
  );
}