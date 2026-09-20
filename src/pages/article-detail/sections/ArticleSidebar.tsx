import { Link } from 'react-router-dom';
import type { Publication } from '../../../api/publications/types';
import { AdSlot } from '../../../components/ads/AdSlot';
import { useTranslation } from 'react-i18next';
import { NewsletterForm } from '../../../components/newsletter/NewsletterForm';

interface Props {
  mostRead: Publication[];
}

/** Right sidebar: Most Read ranking list + newsletter signup CTA. */
export function ArticleSidebar({ mostRead }: Props) {
  const { t } = useTranslation();
  return (
    <aside className="lg:col-span-4 space-y-6">
      <div className="border border-gray-200 bg-white p-6">
        <h3 className="mb-4 w-fit border-b border-brand pb-1 text-label-sm uppercase text-brand">{t('articleDetail.sidebar.mostRead')}</h3>
        <div className="space-y-6">
          {mostRead.map((article, idx) => (
            <Link key={article.id} to={`/article/${article.slug}`} className="group block cursor-pointer">
              <span className="font-headline text-headline-md leading-none text-gray-300 transition-colors group-hover:text-brand">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h4 className="mt-1 text-body-md font-semibold text-gray-900 transition-colors group-hover:text-brand">
                {article.title}
              </h4>
              <p className="mt-1 text-caption text-gray-500">
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <AdSlot placement="SIDEBAR" />

      <div className="bg-brand p-6 text-white">
        <h3 className="mb-2 font-headline text-headline-md">{t('articleDetail.sidebar.morningBrief')}</h3>
        <p className="mb-6 text-body-md opacity-90">{t('articleDetail.sidebar.newsletterText')}</p>
        <NewsletterForm variant="brand" />
        <p className="mt-4 text-[11px] opacity-70">{t('articleDetail.sidebar.termsDisclaimer')}</p>
      </div>
    </aside>
  );
}
