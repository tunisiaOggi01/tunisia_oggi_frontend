import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSearchResults } from '../../hooks/search/useSearchResults';
import { ArticleCard } from '../../components/articles/ArticleCard';
import { ListingCard } from '../../components/listings/ListingCard';
import { SearchSidebar } from './sections/SearchSidebar';
/** Screen-10: combined search — article results (load-more), approved listings, category counts, sidebar ad. */
export function SearchPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const [input, setInput] = useState(q);
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useSearchResults(q);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSearchParams({ q: input.trim() });
  }
  function newSearch() {
    setInput('');
    setSearchParams({});
  }
  const pages = data?.pages ?? [];
  const articles = pages.flatMap((p) => p.articles);
  const first = pages[0];
  const listings = first?.listings ?? [];
  const counts = first?.categoryCounts ?? [];
  const totalArticles = first?.totalArticles ?? 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <form onSubmit={submit} className="flex gap-2 border-b border-gray-200 pb-6">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('search.placeholder')}
          className="flex-1 border border-gray-300 px-4 py-3 text-sm focus:border-brand focus:outline-none"
        />
        <button type="submit" className="bg-brand px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:opacity-90">
          {t('search.go')}
        </button>
      </form>

      {!q && <p className="py-20 text-center text-sm text-gray-400">{t('search.prompt')}</p>}
      {q && (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <div className="flex items-center justify-between">
              <h1 className="font-display text-headline-lg text-gray-900">{t('search.resultsFor', { q })}</h1>
              <button type="button" onClick={newSearch} className="text-sm font-semibold text-brand hover:underline">
                {t('search.newSearch')}
              </button>
            </div>
            <p className="text-sm text-gray-500">{t('search.articlesFound', { n: totalArticles })}</p>

            {isLoading && <p className="py-12 text-sm text-gray-400">{t('search.loading')}</p>}

            {!isLoading && totalArticles === 0 && listings.length === 0 && (
              <p className="border border-gray-200 bg-white p-8 text-center text-body-md text-gray-500">{t('search.empty')}</p>
            )}

            {listings.length > 0 && (
              <section>
                <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand">{t('search.directoryResults')}</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </section>
            )}

            {articles.length > 0 && (
              <section>
                <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand">{t('search.articleResults')}</h2>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} publication={article} />
                  ))}
                </div>
                {hasNextPage && (
                  <button
                    type="button"
                    onClick={() => void fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="mt-8 w-full border border-brand py-3 text-xs font-semibold uppercase tracking-widest text-brand hover:bg-brand hover:text-white disabled:opacity-50"
                  >
                    {isFetchingNextPage ? t('search.loadingMore') : t('search.loadMore')}
                  </button>
                )}
              </section>
            )}
          </div>

          <SearchSidebar counts={counts} />
        </div>
      )}
    </main>
  );
}