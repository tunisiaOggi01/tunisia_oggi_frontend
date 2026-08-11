import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNewsletterAdmin } from '../../hooks/newsletter/useNewsletterAdmin';
import { exportSubscribersCsv } from '../../api/newsletter/admin.api';
import { NewsletterStatsRow } from './sections/NewsletterStatsRow';
import { SubscribersTable } from './sections/SubscribersTable';

/** Screen-12: admin newsletter management — stats tiles, subscriber list, CSV export, soft delete. */
export function AdminNewsletterPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const { stats, subscribers, remove } = useNewsletterAdmin(page);

  const totalPages = Math.max(1, Math.ceil((subscribers?.total ?? 0) / 10));

  function handleExport() {
    setExporting(true);
    void exportSubscribersCsv().finally(() => setExporting(false));
  }

  return (
    <main className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-headline-md text-gray-900">{t('admin.newsletter.title')}</h1>
        <button
          type="button"
          onClick={() => void handleExport()}
          disabled={exporting}
          className="border border-brand px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand hover:bg-brand hover:text-white disabled:opacity-50"
        >
          {t('admin.newsletter.export')}
        </button>
      </div>

      <NewsletterStatsRow stats={stats} />

      {subscribers && subscribers.data.length > 0 ? (
        <>
          <SubscribersTable
            subscribers={subscribers.data}
            removingId={remove.isPending ? remove.variables : undefined}
            onRemove={(id) => remove.mutate(id)}
          />
          <div className="flex items-center justify-between text-sm text-gray-500">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="font-semibold text-brand hover:underline disabled:opacity-40"
            >
              {t('common.previous')}
            </button>
            <span>
              {t('common.pageOf', { current: page, total: totalPages })}
            </span>
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
        <p className="border border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
          {t('admin.newsletter.empty')}
        </p>
      )}
    </main>
  );
}