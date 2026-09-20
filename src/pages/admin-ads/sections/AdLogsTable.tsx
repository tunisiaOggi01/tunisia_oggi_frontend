import { useTranslation } from 'react-i18next';
import { useAdLogs } from '../../../hooks/ads/useAdLogs';
import { formatDate } from '../../../utils/formatDate';
import type { AdLog } from '../../../api/ads/types';

const ACTION_CLASS: Record<string, string> = {
  CREATE: 'border-green-300 bg-green-50 text-green-700',
  UPDATE: 'border-amber-300 bg-amber-50 text-amber-700',
  DELETE: 'border-red-300 bg-red-50 text-red-700',
};

/** Read-only table of ad audit logs: action, ad title, admin, changes, timestamp. */
export function AdLogsTable() {
  const { t, i18n } = useTranslation();
  const { data } = useAdLogs();
  const cell = 'py-3 pr-4';

  function changesSummary(changes: AdLog['changes']): string {
    if (!changes) return '—';
    const keys = Object.keys(changes);
    if (keys.length === 0) return '—';
    return keys.join(', ');
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
            <th className={cell}>{t('admin.ads.logsColAction')}</th>
            <th className={cell}>{t('admin.ads.logsColAd')}</th>
            <th className={cell}>{t('admin.ads.logsColAdmin')}</th>
            <th className={cell}>{t('admin.ads.logsColChanges')}</th>
            <th className={cell}>{t('admin.ads.logsColDate')}</th>
          </tr>
        </thead>
        <tbody>
          {(data?.data ?? []).map((log) => (
            <tr key={log.id} className="border-b border-gray-100">
              <td className={cell}>
                <span className={`rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${ACTION_CLASS[log.action]}`}>
                  {log.action}
                </span>
              </td>
              <td className={`${cell} font-medium`}>{log.adTitle}</td>
              <td className={cell}>
                <span className="text-gray-900">{log.adminName}</span>
                <span className="ml-1 text-gray-400">({log.adminEmail})</span>
              </td>
              <td className={`${cell} max-w-[200px] truncate text-gray-500`}>{changesSummary(log.changes)}</td>
              <td className={`${cell} whitespace-nowrap`}>{formatDate(log.createdAt, i18n.language)}</td>
            </tr>
          ))}
          {(data?.data ?? []).length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-gray-400">
                {t('admin.ads.logsEmpty')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-500">{data?.total ?? 0} logs</span>
      </div>
    </div>
  );
}
