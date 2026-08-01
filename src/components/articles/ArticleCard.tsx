import { Link } from 'react-router-dom';
import type { Publication } from '../../api/publications/types';
import { useTranslation } from 'react-i18next';

function readTime(body: string) {
  return Math.max(1, Math.ceil(body.split(' ').length / 200));
}

/** Compact article preview: image, category tag, title, date + read time. Used in grids and related-article lists. */
export function ArticleCard({ publication }: { publication: Publication }) {
  const { t } = useTranslation();
  return (
    <article className="group">
      <Link to={`/article/${publication.slug}`}>
        {publication.featuredImageUrl && (
          <div className="aspect-[16/10] overflow-hidden bg-gray-100">
            <img
              src={publication.featuredImageUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-brand">
          {publication.category.name}
        </p>
        <h3 className="mt-1 font-serif text-xl font-bold leading-snug text-gray-900 group-hover:underline">
          {publication.title}
        </h3>
      </Link>
      <p className="mt-2 text-xs text-gray-500">
        {publication.publishedAt
          ? `${new Date(publication.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • ${t('components.articleCard.minRead', { n: readTime(publication.body) })}`
          : ''}
      </p>
    </article>
  );
}
