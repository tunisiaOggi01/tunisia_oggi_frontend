import { Link } from 'react-router-dom';
import type { Publication } from '../../api/publications/types';

/** Compact article preview: image, category tag, title, date. Used in grids and related-article lists. */
export function ArticleCard({ publication }: { publication: Publication }) {
  return (
    <article>
      <Link to={`/article/${publication.slug}`}>
        {publication.featuredImageUrl && (
          <img src={publication.featuredImageUrl} alt="" className="mb-2 aspect-video w-full rounded object-cover" />
        )}
        <p className="text-xs font-semibold uppercase text-brand">{publication.category.name}</p>
        <h3 className="font-serif text-lg font-bold text-gray-900">{publication.title}</h3>
      </Link>
      <p className="mt-1 text-xs text-gray-500">
        {publication.publishedAt ? new Date(publication.publishedAt).toLocaleDateString() : ''}
      </p>
    </article>
  );
}
