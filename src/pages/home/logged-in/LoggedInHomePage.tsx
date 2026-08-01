import { Link } from 'react-router-dom';
import { usePublishedArticles } from '../../../hooks/publications/usePublishedArticles';
import { PostComposer } from './PostComposer';
import { SidebarSections } from './SidebarSections';
import { useTranslation } from 'react-i18next';

/** Logged-in homepage: composer, personalized feed, trending sidebar. */
export function LoggedInHomePage() {
  const { t } = useTranslation();
  const { data } = usePublishedArticles({ pageSize: 10 });
  const articles = data?.pages.flatMap((p) => p.data) ?? [];
  const trending = [...articles].sort((a, b) => b.views - a.views);

  if (articles.length === 0) return null;

  return (
    <main className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-6  px-4 py-8 md:px-8">
      <div className="col-span-12 space-y-8 lg:col-span-8">
        <PostComposer />

        <section>
          <div className="mb-4 flex items-baseline justify-between border-b-2 border-gray-900 pb-2">
            <h2 className="font-headline text-headline-lg">{t('home.loggedIn.yourFeed')}</h2>
            <span className="font-sans text-sm font-semibold tracking-widest text-gray-500">
              {t('home.loggedIn.feedSubtitle')}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {articles.slice(0, 2).map((article) => (
              <Link key={article.id} to={`/article/${article.slug}`} className="group cursor-pointer">
                {article.featuredImageUrl && (
                  <div className="relative mb-4 aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={article.featuredImageUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4 bg-brand px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                      {article.category.name}
                    </div>
                  </div>
                )}
                <h3 className="mb-2 font-headline text-headline-md transition-colors group-hover:text-brand">
                  {article.title}
                </h3>
                <p className="line-clamp-2 text-base text-gray-500">{article.body}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <span>{t('home.loggedIn.publishedBy', { author: article.author.username })}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span>{t('home.loggedIn.minRead', { n: Math.max(1, Math.ceil(article.body.split(' ').length / 200)) })} mins read</span>
                </div>
              </Link>
            ))}
          </div>

          {articles.length > 2 && (
            <div className="mt-8 border-t border-gray-200 pt-4">
              <div className="grid gap-6 md:grid-cols-3">
                {articles.slice(2, 5).map((article) => (
                  <Link key={article.id} to={`/article/${article.slug}`} className="flex gap-4 group cursor-pointer">
                    {article.featuredImageUrl && (
                      <div className="h-20 w-20 shrink-0 bg-gray-100">
                        <img src={article.featuredImageUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold leading-snug transition-colors group-hover:text-brand">
                        {article.title}
                      </h4>
                      <span className="text-xs uppercase text-gray-500">{article.category.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <aside className="col-span-12 lg:col-span-4">
        <SidebarSections trending={trending} />
      </aside>
    </main>
  );
}
