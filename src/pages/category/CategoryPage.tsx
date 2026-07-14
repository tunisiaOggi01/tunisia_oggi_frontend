import { useParams } from 'react-router-dom';
import { usePublishedArticles } from '../../hooks/publications/usePublishedArticles';
import { ArticleCard } from '../../components/articles/ArticleCard';

function capitalize(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

/** Lists published articles filtered by the :slug route param. */
export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = usePublishedArticles({ categorySlug: slug, page: 1, pageSize: 10 });

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="mb-1 border-l-4 border-brand pl-3 font-serif text-4xl font-bold text-gray-900">
        {slug ? capitalize(slug) : ''}
      </h1>

      {isLoading && <p className="mt-8 text-gray-500">Loading...</p>}

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-8 md:col-span-2">
          {data?.data.map((publication) => (
            <ArticleCard key={publication.id} publication={publication} />
          ))}
        </div>
        <aside className="border border-gray-200 p-4">
          <h2 className="text-sm font-semibold uppercase text-gray-500">Trending</h2>
        </aside>
      </div>
    </div>
  );
}
