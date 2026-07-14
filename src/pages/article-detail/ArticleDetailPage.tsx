import { useParams, Link } from 'react-router-dom';
import { useArticleDetail } from '../../hooks/publications/useArticleDetail';
import { ArticleCard } from '../../components/articles/ArticleCard';

/** Full article view: breadcrumb, hero image, body, tags, and related articles. */
export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { publication, related, isLoading } = useArticleDetail(slug);

  if (isLoading || !publication) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <p className="text-xs text-gray-500">
        <Link to="/">Home</Link> &gt; <Link to={`/category/${publication.category.slug}`}>{publication.category.name}</Link> &gt; Article
      </p>

      <p className="mt-4 text-xs font-semibold uppercase text-brand">{publication.category.name}</p>
      <h1 className="mt-2 font-serif text-4xl font-bold text-gray-900">{publication.title}</h1>

      <p className="mt-4 text-sm text-gray-500">
        By {publication.author.username} · Published{' '}
        {publication.publishedAt ? new Date(publication.publishedAt).toLocaleDateString() : ''}
      </p>

      {publication.featuredImageUrl && (
        <img src={publication.featuredImageUrl} alt="" className="mt-6 w-full rounded object-cover" />
      )}

      <div className="prose mt-6 max-w-none whitespace-pre-line text-gray-800">{publication.body}</div>

      <div className="mt-6 flex gap-2">
        {publication.tags.map((tag) => (
          <span key={tag} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
            #{tag}
          </span>
        ))}
      </div>

      {related && related.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-sm font-semibold uppercase text-gray-500">Related Articles</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.id} publication={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
