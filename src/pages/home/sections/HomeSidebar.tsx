import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NewsletterBox } from '../NewsletterBox';
import { AdSlot } from '../../../components/ads/AdSlot';
import { ServicesList } from '../../../components/listings/ServicesList';
import { formatDate } from '../../../utils/formatDate';
import type { Publication } from '../../../api/publications/types';

/** Homepage right rail: newsletter signup, services from the annuario, numbered trending list, and the sidebar ad slot. */
export function HomeSidebar({ trending }: { trending: Publication[] }) {
  const { i18n } = useTranslation();

  return (
    <aside className="space-y-8 md:col-span-4">
      <NewsletterBox />
      <ServicesList />
      <div className="space-y-6">
        {trending.map((article, idx) => (
          <Link
            key={article.id}
            to={`/article/${article.slug}`}
            className="group flex cursor-pointer items-start gap-4"
          >
            <span className="font-serif text-3xl font-bold text-gray-300">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <div>
              <h5 className="text-sm font-semibold text-gray-700 transition-colors group-hover:text-brand">
                {article.title}
              </h5>
              <p className="mt-1 text-xs text-gray-400">
                {article.publishedAt ? formatDate(article.publishedAt, i18n.language) : ''}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="aspect-square">
        <AdSlot placement="SIDEBAR" />
      </div>
    </aside>
  );
}