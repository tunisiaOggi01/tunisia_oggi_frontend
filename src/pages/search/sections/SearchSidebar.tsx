import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdSlot } from '../../../components/ads/AdSlot';
import type { CategoryCount } from '../../../api/search/search.api';

/** Search-page right rail: category hit counts (server-side) above the sidebar ad slot. */
export function SearchSidebar({ counts }: { counts: CategoryCount[] }) {
  const { t } = useTranslation();

  return (
    <aside className="space-y-6 lg:col-span-4">
      {counts.length > 0 && (
        <div className="border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
            {t('search.categories')}
          </h2>
          <ul className="space-y-2">
            {counts.map((c) => (
              <li key={c.id} className="flex items-center justify-between text-sm">
                <Link to={`/category/${c.slug}`} className="text-gray-700 hover:text-brand">
                  {c.name}
                </Link>
                <span className="text-xs text-gray-400">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <AdSlot placement="SIDEBAR" />
    </aside>
  );
}