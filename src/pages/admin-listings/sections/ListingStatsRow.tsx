import { useTranslation } from 'react-i18next';
import type { ListingStats } from '../../../api/listings/admin.api';

/** Stats tiles row: pending review count, total views and clicks across the directory. */
export function ListingStatsRow({ stats }: { stats?: ListingStats }) {
  const { t } = useTranslation();
  const tiles: { key: string; value: number }[] = [
    { key: 'pending', value: stats?.pending ?? 0 },
    { key: 'totalViews', value: stats?.totalViews ?? 0 },
    { key: 'totalClicks', value: stats?.totalClicks ?? 0 },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {tiles.map((tile) => (
        <div key={tile.key} className="border border-gray-200 bg-white p-5">
          <p className="text-2xl font-bold text-brand">{tile.value}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
            {t(`admin.listings.stats.${tile.key}`)}
          </p>
        </div>
      ))}
    </div>
  );
}