import { useEffect } from 'react';
import { usePublishedArticles } from '../../hooks/publications/usePublishedArticles';
import { useInfiniteScroll } from '../../hooks/common/useInfiniteScroll';
import { useAuth } from '../../context/AuthContext';
import { FeaturedArticle } from '../../components/articles/FeaturedArticle';
import { ArticleCard } from '../../components/articles/ArticleCard';
import { HomePageSkeleton } from './HomePageSkeleton';
import { AdStrip } from '../../components/ads/AdStrip';
import { HomeSidebar } from './sections/HomeSidebar';
import { useToast } from '../../components/common/Toast';
import { Link } from 'react-router-dom';
import { LoggedInHomePage } from './logged-in/LoggedInHomePage';
import { useTranslation } from 'react-i18next';

/** Homepage: hero article, CTA, latest-updates grid with infinite scroll, and a trending sidebar. Renders a different layout when the user is logged in. */
export function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = usePublishedArticles({ pageSize: 5, enabled: !user });
  const sentinelRef = useInfiniteScroll(fetchNextPage, !!hasNextPage && !isFetchingNextPage);
  const { showToast } = useToast();

  useEffect(() => {
    if (isError) showToast(t('home.errorLoading'), 'error');
  }, [isError, showToast]);

  if (user) return <LoggedInHomePage />;
  if (isLoading || !data) return <HomePageSkeleton />;

  const articles = data.pages.flatMap((p) => p.data);
  if (articles.length === 0) return <HomePageSkeleton />;

  const [featured, ...rest] = articles;
  const trending = [...articles].sort((a, b) => b.views - a.views).slice(0, 3);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {featured && <FeaturedArticle publication={featured} />}
      <AdStrip />

      <section className="mb-8 flex flex-col items-center justify-between gap-8 border border-gray-200 bg-brand p-8 text-white md:flex-row md:p-12">
        <div>
          <h2 className="font-serif text-xl font-bold">{t('home.becomeContributor')}</h2>
          <p className="mt-1 text-sm opacity-90">
            {t('home.contributorBody')}
          </p>
        </div>
        <Link
          to="/admin/articles"
          className="whitespace-nowrap rounded-full bg-white px-8 py-3 text-sm font-bold text-brand transition-all hover:opacity-90 active:scale-95"
        >
          {t('home.createFirstArticle')}
        </Link>
      </section>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3">
        <div className="border-b border-gray-200 pb-2 md:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-brand">{t('home.latestUpdates')}</h2>
        </div>
        <div className="hidden border-b border-gray-200 pb-2 md:block">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-brand">{t('home.trendingNow')}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {rest.map((publication) => (
              <ArticleCard key={publication.id} publication={publication} />
            ))}
          </div>
          <div ref={sentinelRef} className="h-4" />
          {isFetchingNextPage && <p className="py-4 text-center text-sm text-gray-400">{t('home.loadingMore')}</p>}
        </div>

        <HomeSidebar trending={trending} />
      </div>
    </main>
  );
}
