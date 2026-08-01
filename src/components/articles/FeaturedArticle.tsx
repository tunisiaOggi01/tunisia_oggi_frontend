import { Link } from 'react-router-dom';
import type { Publication } from '../../api/publications/types';
import { useTranslation } from 'react-i18next';

/** Large hero treatment for the single most recent published article on the homepage. */
export function FeaturedArticle({ publication }: { publication: Publication }) {
  const { t } = useTranslation();
  return (
    <section className="group mb-8 overflow-hidden border border-gray-200 bg-white">
      <div className="flex min-h-[500px] flex-col lg:flex-row">
        <div className="relative w-full lg:w-2/3">
          {publication.featuredImageUrl && (
            <img
              src={publication.featuredImageUrl}
              alt=""
              className="aspect-[2/1] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
        </div>
        <div className="flex flex-col justify-center border-gray-200 bg-white p-8 lg:w-1/3 lg:border-l lg:p-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-brand">
            {publication.category.name}
          </p>
          <h1 className="font-serif text-3xl font-bold leading-tight md:text-4xl">
            {publication.title}
          </h1>
          <p className="mt-4 leading-relaxed text-gray-600">
            {publication.body.slice(0, 220)}
          </p>
          <Link
            to={`/article/${publication.slug}`}
            className="mt-6 inline-flex items-center text-sm font-semibold text-brand transition-transform duration-300 hover:translate-x-2"
          >
            {t('components.featuredArticle.readMore')} <span className="material-symbols-outlined ml-1 text-lg">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
