import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { useListingsAdmin } from '../../hooks/listings/admin/useListingsAdmin';
import { ListingStatsRow } from './sections/ListingStatsRow';
import { ListingsTable } from './sections/ListingsTable';
import type { ListingStatus } from '../../api/listings/types';

/** Admin directory review screen: pending queue with approve/reject/delete and stats. */
export function AdminListingsPage() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<ListingStatus | undefined>(undefined);
  const [page, setPage] = useState(1);
  const { listings, stats, review, remove } = useListingsAdmin(status, page);

  const busyId = review.isPending ? review.variables?.id : remove.isPending ? remove.variables : undefined;
  const totalPages = Math.max(1, Math.ceil((listings?.total ?? 0) / 10));

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-800">{t('admin.listings.pageTitle')}</h1>
            <p className="mt-1 text-sm text-gray-500">{t('admin.listings.pageSubtitle')}</p>
          </div>
        </div>

        <div className="mt-6">
          <ListingStatsRow stats={stats} />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <select
            value={status ?? ''}
            onChange={(e) => {
              setStatus((e.target.value || undefined) as ListingStatus | undefined);
              setPage(1);
            }}
            className="border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          >
            <option value="">{t('admin.listings.allStatuses')}</option>
            <option value="PENDING">{t('admin.listings.status.pending')}</option>
            <option value="APPROVED">{t('admin.listings.status.approved')}</option>
            <option value="REJECTED">{t('admin.listings.status.rejected')}</option>
          </select>
        </div>

        {listings && listings.data.length > 0 ? (
          <>
            <div className="mt-4">
              <ListingsTable
                listings={listings.data}
                busyId={busyId}
                onStatus={(id, next) => review.mutate({ id, status: next })}
                onDelete={(id) => remove.mutate(id)}
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="font-semibold text-brand hover:underline disabled:opacity-40"
              >
                {t('common.previous')}
              </button>
              <span>{t('common.pageOf', { current: page, total: totalPages })}</span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="font-semibold text-brand hover:underline disabled:opacity-40"
              >
                {t('common.next')}
              </button>
            </div>
          </>
        ) : (
          <p className="mt-4 border border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
            {t('admin.listings.empty')}
          </p>
        )}
      </div>
    </div>
  );
}