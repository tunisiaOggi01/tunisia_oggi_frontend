import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { StatCard } from '../../components/admin/StatCard';
import { fetchPublicationStats } from '../../api/publications/admin.api';
import { fetchListingStats } from '../../api/listings/admin.api';
import { fetchAdStats } from '../../api/ads/admin.api';
import { fetchNewsletterStats } from '../../api/newsletter/admin.api';
import { useCategories } from '../../hooks/categories/useCategories';
import { useUsers } from '../../hooks/users/useUsers';
import { formatNumber } from '../../utils/formatNumber';

interface ModuleCard {
  to: string;
  icon: string;
  title: string;
  desc: string;
  value: number | undefined;
  metric: string;
  hint?: string;
  highlight?: boolean;
}

/** Admin landing page: key figures across modules plus one card per management area. */
export function AdminDashboardPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  // Same query keys as the module pages, so their caches are shared.
  const { data: pubStats } = useQuery({ queryKey: ['publications', 'stats'], queryFn: fetchPublicationStats });
  const { data: listingStats } = useQuery({ queryKey: ['admin', 'listings', 'stats'], queryFn: fetchListingStats });
  const { data: adStats } = useQuery({ queryKey: ['ads', 'stats'], queryFn: fetchAdStats });
  const { data: newsletterStats } = useQuery({ queryKey: ['newsletter', 'stats'], queryFn: fetchNewsletterStats });
  const { data: categories } = useCategories();
  const { data: users } = useUsers();

  const fmt = (n: number | undefined) => (n === undefined ? '—' : formatNumber(n, i18n.language));

  const modules: ModuleCard[] = [
    {
      to: '/admin/articles', icon: 'article', title: t('admin.dashboard.articles'), desc: t('admin.dashboard.articlesDesc'),
      value: pubStats?.totalArticles, metric: t('admin.dashboard.articlesMetric'),
      hint: pubStats ? t('admin.dashboard.draftsHint', { n: pubStats.activeDrafts }) : undefined,
    },
    {
      to: '/admin/categories', icon: 'category', title: t('admin.dashboard.categories'), desc: t('admin.dashboard.categoriesDesc'),
      value: categories?.length, metric: t('admin.dashboard.categoriesMetric'),
    },
    {
      to: '/admin/users', icon: 'group', title: t('admin.dashboard.users'), desc: t('admin.dashboard.usersDesc'),
      value: users?.length, metric: t('admin.dashboard.usersMetric'),
    },
    {
      to: '/admin/listings', icon: 'storefront', title: t('admin.dashboard.listings'), desc: t('admin.dashboard.listingsDesc'),
      value: listingStats?.pending, metric: t('admin.dashboard.listingsMetric'),
      highlight: (listingStats?.pending ?? 0) > 0,
    },
    {
      to: '/admin/ads', icon: 'campaign', title: t('admin.dashboard.ads'), desc: t('admin.dashboard.adsDesc'),
      value: adStats?.active, metric: t('admin.dashboard.adsMetric'),
    },
    {
      to: '/admin/newsletter', icon: 'mail', title: t('admin.dashboard.newsletter'), desc: t('admin.dashboard.newsletterDesc'),
      value: newsletterStats?.active, metric: t('admin.dashboard.newsletterMetric'),
    },
  ];

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-4 md:p-8">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">
              {user ? t('admin.dashboard.greeting', { name: user.username }) : t('admin.dashboard.pageTitle')}
            </p>
            <h1 className="mt-1 font-serif text-3xl font-bold text-gray-900">{t('admin.dashboard.pageTitle')}</h1>
            <p className="mt-1 text-sm text-gray-500">{t('admin.dashboard.pageSubtitle')}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="flex h-10 items-center gap-1 border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition-colors hover:border-brand hover:text-brand">
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              {t('admin.dashboard.viewSite')}
            </Link>
            <Link to="/admin/articles" className="flex h-10 items-center gap-1 bg-brand px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              <span className="material-symbols-outlined text-[18px]">add</span>
              {t('admin.dashboard.newArticle')}
            </Link>
          </div>
        </div>

        <h2 className="mt-8 text-xs font-semibold uppercase tracking-widest text-gray-500">{t('admin.dashboard.overview')}</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label={t('admin.dashboard.totalViews')} value={fmt(pubStats?.totalViews)} />
          <StatCard label={t('admin.dashboard.adImpressions')} value={fmt(adStats?.totalImpressions)} />
          <StatCard label={t('admin.dashboard.adClicks')} value={fmt(adStats?.totalClicks)} />
          <StatCard label={t('admin.dashboard.newSubscribers')} value={fmt(newsletterStats?.newThisWeek)} />
        </div>

        <h2 className="mt-10 text-xs font-semibold uppercase tracking-widest text-gray-500">{t('admin.dashboard.modules')}</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="group flex flex-col border border-gray-200 bg-white p-6 transition-all hover:border-brand hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <span className="material-symbols-outlined text-[24px]">{m.icon}</span>
                </span>
                {m.highlight && (
                  <span className="bg-brand px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {t('admin.dashboard.toReview')}
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-gray-900">{m.title}</h3>
              <p className="mt-1 flex-1 text-sm text-gray-500">{m.desc}</p>
              <div className="mt-5 flex items-end justify-between border-t border-gray-100 pt-4">
                <div>
                  <span className="text-2xl font-bold text-gray-900">{fmt(m.value)}</span>
                  <span className="ml-1.5 text-sm text-gray-500">{m.metric}</span>
                  {m.hint && <p className="text-xs text-gray-400">{m.hint}</p>}
                </div>
                <span className="flex items-center text-sm font-semibold text-brand transition-transform group-hover:translate-x-1">
                  {t('admin.dashboard.manage')}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
