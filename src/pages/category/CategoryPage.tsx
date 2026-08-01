import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePublishedArticles } from '../../hooks/publications/usePublishedArticles';
import { useInfiniteScroll } from '../../hooks/common/useInfiniteScroll';
import { useTranslation } from 'react-i18next';

type Tab = 'all' | 'recent' | 'archive';

function capitalize(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

/** Category page with All/Recent/Archive tabs, horizontal article cards, trending sidebar, and infinite scroll. */
export function CategoryPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [tab, setTab] = useState<Tab>('all');
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = usePublishedArticles({
    categorySlug: slug,
    pageSize: 10,
  });
  const sentinelRef = useInfiniteScroll(fetchNextPage, !!hasNextPage && !isFetchingNextPage);

  const allArticles = data?.pages.flatMap((p) => p.data) ?? [];
  const articles = tab === 'recent'
    ? allArticles.filter((a) => Date.now() - new Date(a.publishedAt ?? a.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000)
    : tab === 'archive'
      ? allArticles.filter((a) => Date.now() - new Date(a.publishedAt ?? a.createdAt).getTime() >= 7 * 24 * 60 * 60 * 1000)
      : allArticles;
  const trending = [...allArticles].sort((a, b) => b.views - a.views).slice(0, 3);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: t('category.all') },
    { key: 'recent', label: t('category.recent') },
    { key: 'archive', label: t('category.archive') },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-8">
        <div className="mb-4 h-1 w-16 bg-brand" />
        <h1 className="font-display text-headline-lg text-gray-900 mb-4">
          {slug ? capitalize(slug) : ''}
        </h1>
        <div className="flex items-center gap-8 border-b border-surface-container-highest">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`py-4 text-label-sm border-b-2 transition-colors ${
                tab === t.key ? 'text-brand border-brand' : 'text-gray-500 border-transparent hover:text-brand'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p className="text-gray-500 text-center py-12">{t('category.loading')}</p>}

      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-6">
            {articles.map((article) => (
              <Link key={article.id} to={`/article/${article.slug}`}
                className="group flex flex-col md:flex-row gap-4 border-b border-surface-container pb-6 transition-transform duration-300 hover:-translate-y-0.5">
                {article.featuredImageUrl && (
                  <div className="md:w-1/3 overflow-hidden">
                    <img src={article.featuredImageUrl} alt=""
                      className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="md:w-2/3 flex flex-col justify-center">
                  <span className="text-label-sm text-brand uppercase mb-1">{article.category.name}</span>
                  <h2 className="font-headline text-headline-md transition-colors group-hover:text-brand mb-1">
                    {article.title}
                  </h2>
                  <p className="text-gray-500 text-body-md line-clamp-2 mb-3">{article.body}</p>
                  <div className="flex items-center gap-4 text-caption text-gray-500">
                    <span>{t('category.publishedBy', { author: article.author.username })}</span>
                    <span>&bull;</span>
                    <span>{article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                          month: 'long', day: 'numeric', year: 'numeric',
                        })
                      : ''}</span>
                  </div>
                </div>
              </Link>
            ))}
            <div ref={sentinelRef} className="h-4" />
            {isFetchingNextPage && <p className="py-4 text-center text-sm text-gray-400">{t('category.loadingMore')}</p>}
          </div>

          <aside className="md:col-span-4 space-y-6">
            <div className="bg-white p-4 border border-gray-200">
              <h3 className="font-headline text-headline-md mb-4 border-l-4 border-brand pl-3">{t('category.trending')}</h3>
              <ul className="space-y-4">
                {trending.map((article, idx) => (
                  <li key={article.id} className="group cursor-pointer">
                    <span className="text-brand font-bold font-headline text-headline-md block mb-1">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <Link to={`/article/${article.slug}`}
                      className="text-body-md font-semibold transition-colors group-hover:text-brand">
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-brand p-6 text-white">
              <h3 className="font-headline text-headline-md mb-3">{t('category.newsletterHeading', { slug: capitalize(slug ?? '') })}</h3>
              <p className="text-body-md mb-5 opacity-90">{t('category.newsletterText', { slug })}</p>
              <div className="space-y-3">
                <input type="email" placeholder={t('category.emailPlaceholder')}
                  className="w-full bg-white/10 border border-white/20 px-4 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40" />
                <button
                  className="w-full bg-white text-brand font-label-sm py-3 uppercase tracking-widest hover:bg-gray-100 transition-colors">
                  {t('category.subscribeNow')}
                </button>
              </div>
            </div>

            <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
              <span className="text-label-sm uppercase opacity-50">{t('category.advertisement')}</span>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
