import { StatCard } from '../../components/admin/StatCard';
import type { PublicationStats } from '../../api/publications/admin.api';

/** The 4 dashboard tiles: Total Articles / Active Drafts / Total Views / Comments (always 0). */
export function ArticlesStatsRow({ stats }: { stats: PublicationStats | undefined }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
      <StatCard label="Total Articles" value={stats ? stats.totalArticles.toLocaleString() : '—'} />
      <StatCard label="Active Drafts" value={stats ? String(stats.activeDrafts) : '—'} />
      <StatCard label="Total Views" value={stats ? `${(stats.totalViews / 1000).toFixed(1)}K` : '—'} />
      <StatCard label="Comments" value={stats ? String(stats.comments) : '0'} />
    </div>
  );
}
