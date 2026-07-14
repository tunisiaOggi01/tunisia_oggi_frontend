import { Link } from 'react-router-dom';
import type { Publication } from '../../api/publications/types';

/** Large hero treatment for the single most recent published article on the homepage. */
export function FeaturedArticle({ publication }: { publication: Publication }) {
  return (
    <div className="grid grid-cols-1 gap-6 border border-gray-200 bg-white p-6 md:grid-cols-2">
      {publication.featuredImageUrl && (
        <img src={publication.featuredImageUrl} alt="" className="h-full w-full rounded object-cover" />
      )}
      <div>
        <p className="text-xs font-semibold uppercase text-brand">{publication.category.name}</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-gray-900">{publication.title}</h1>
        <p className="mt-3 text-gray-600">{publication.body.slice(0, 220)}</p>
        <Link to={`/article/${publication.slug}`} className="mt-4 inline-block font-semibold text-brand">
          READ MORE →
        </Link>
      </div>
    </div>
  );
}
