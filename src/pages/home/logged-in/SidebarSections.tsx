import type { Publication } from '../../../api/publications/types';
import { useTranslation } from 'react-i18next';
import { AdSlot } from '../../../components/ads/AdSlot';
import { NewsletterForm } from '../../../components/newsletter/NewsletterForm';

/** Trending Now (numbered 1-3 with view counts) + Editor's Picks + Subscribe promo, with the sidebar ad slot. */
export function SidebarSections({ trending }: { trending: Publication[] }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <AdSlot placement="SIDEBAR" />
      <section className="border border-gray-200 bg-gray-50 p-4">
        <h3 className="flex items-center justify-between border-b border-gray-400 pb-2 text-sm font-semibold uppercase tracking-widest">
          {t('home.sidebar.trendingNow')}
          <span className="material-symbols-outlined text-lg text-brand">trending_up</span>
        </h3>
        <ul className="mt-4 space-y-4">
          {trending.slice(0, 3).map((article, idx) => (
            <li key={article.id} className="group flex cursor-pointer gap-4">
              <span className="font-serif text-headline-md leading-none text-gray-300">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div>
                <h4 className="text-sm font-semibold leading-tight transition-colors group-hover:text-brand">
                  {article.title}
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  {t('home.sidebar.nViewsToday', { n: article.views })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-4 border-b border-gray-900 pb-2 text-sm font-semibold uppercase tracking-widest">
          {t('home.sidebar.editorsPicks')}
        </h3>
        <div className="space-y-6">
          {trending.slice(0, 1).map((article) => (
            <div key={article.id} className="group cursor-pointer">
              {article.featuredImageUrl && (
                <div className="mb-3 aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={article.featuredImageUrl}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <h4 className="text-sm font-semibold transition-colors group-hover:text-brand">
                {article.title}
              </h4>
              <p className="mt-1 text-xs text-gray-500">{t('home.sidebar.publishedBy', { author: article.author.username })}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="group relative overflow-hidden bg-[#c00000] p-6 text-white">
        <div className="relative z-10">
          <h3 className="mb-2 font-headline text-headline-md">{t('home.sidebar.subscribeDailyBrief')}</h3>
          <p className="mb-4 text-base opacity-90">
            {t('home.sidebar.subscribeDailyBriefText')}
          </p>
          <NewsletterForm variant="dark" />
        </div>
        <div className="absolute -bottom-8 -right-8 opacity-10 transition-transform duration-700 group-hover:scale-110">
          <span className="material-symbols-outlined text-[120px]">newspaper</span>
        </div>
      </div>
    </div>
  );
}
