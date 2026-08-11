import { useTranslation } from 'react-i18next';
import type { NewsletterStats } from '../../../api/newsletter/admin.api';

/** Stats tiles row: active subscribers, new this week, all-time soft-deleted. */
export function NewsletterStatsRow({ stats }: { stats?: NewsletterStats }) {
  const { t } = useTranslation();
  const tiles = [
    { key: 'active', value: stats?.active ?? 0 },
    { key: 'newThisWeek', value: stats?.newThisWeek ?? 0 },
    { key: 'softDeleted', value: stats?.softDeleted ?? 0 },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {tiles.map((tile) => (
        <div key={tile.key} className="border border-gray-200 bg-white p-5">
          <p className="text-2xl font-bold text-brand">{tile.value}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
            {t(`admin.newsletter.stats.${tile.key}`)}
          </p>
        </div>
      ))}
    </div>
  );
}