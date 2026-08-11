import { useTranslation } from 'react-i18next';
import type { AdStats } from '../../../api/ads/types';

const TILE_KEYS = [
  'admin.ads.scheduled',
  'admin.ads.active',
  'admin.ads.expired',
  'admin.ads.totalImpressions',
  'admin.ads.totalClicks',
] as const;

/** Small stat tiles for the ads manager: scheduled/active/expired ads + counter totals. */
export function AdsStatsRow({ stats }: { stats?: AdStats }) {
  const { t } = useTranslation();
  const values = stats
    ? [stats.scheduled, stats.active, stats.expired, stats.totalImpressions, stats.totalClicks]
    : [0, 0, 0, 0, 0];

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
      {TILE_KEYS.map((key, i) => (
        <div key={key} className="border border-gray-200 bg-white p-4">
          <p className="text-2xl font-bold text-brand">{values[i]}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-500">{t(key)}</p>
        </div>
      ))}
    </div>
  );
}