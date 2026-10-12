import { useTranslation } from 'react-i18next';
import { formatNumber } from '../../../utils/formatNumber';
import { StatCard } from '../../../components/admin/StatCard';
import type { PublicationStats } from '../../../api/publications/admin.api';

/** The 4 dashboard tiles: Total Articles / Active Drafts / Total Views / Comments (always 0). */
export function ArticlesStatsRow({ stats }: { stats: PublicationStats | undefined }) {
  const { t, i18n } = useTranslation();
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
      <StatCard label={t('admin.stats.totalArticles')} value={stats ? formatNumber(stats.totalArticles, i18n.language) : '—'} />
      <StatCard label={t('admin.stats.activeDrafts')} value={stats ? String(stats.activeDrafts) : '—'} />
      <StatCard label={t('admin.stats.totalViews')} value={stats ? `${(stats.totalViews / 1000).toFixed(1)}K` : '—'} />
      <StatCard label={t('admin.stats.comments')} value={stats ? String(stats.comments) : '0'} />
    </div>
  );
}
