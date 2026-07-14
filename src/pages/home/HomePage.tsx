import { usePublishedArticles } from '../../hooks/publications/usePublishedArticles';
import { FeaturedArticle } from '../../components/articles/FeaturedArticle';
import { ArticleCard } from '../../components/articles/ArticleCard';
import { NewsletterBox } from './NewsletterBox';

/** Homepage: hero article, latest-updates grid, and a trending sidebar. */
export function HomePage() {
  const { data, isLoading } = usePublishedArticles({ page: 1, pageSize: 5 });

  if (isLoading || !data) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const [featured, ...rest] = data.data;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {featured && <FeaturedArticle publication={featured} />}

      <div className="mt-8 bg-brand p-6 text-white">
        <h2 className="font-serif text-xl font-bold">Become a Contributor</h2>
        <p className="mt-1 text-sm">Share your perspective with our growing community of readers.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="mb-4 text-sm font-semibold uppercase text-gray-500">Latest Updates</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {rest.map((publication) => (
              <ArticleCard key={publication.id} publication={publication} />
            ))}
          </div>
        </div>

        <aside>
          <h2 className="mb-4 text-sm font-semibold uppercase text-gray-500">Trending Now</h2>
          <NewsletterBox />
          <div className="mt-6 flex h-64 items-center justify-center border border-dashed border-gray-300 text-sm text-gray-400">
            ADVERTISEMENT
          </div>
        </aside>
      </div>
    </div>
  );
}
