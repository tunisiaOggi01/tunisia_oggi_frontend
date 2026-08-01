import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { PaginatedPublications, Publication } from '../../../api/publications/types';
import { useAuth } from '../../../context/AuthContext';

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-700',
  DRAFT: 'bg-yellow-100 text-yellow-700',
  SCHEDULED: 'bg-blue-100 text-blue-700',
};

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  articles: PaginatedPublications | undefined;
  onDelete: (id: string) => void;
  onEdit: (article: Publication) => void;
}

/** Search bar + article table with conditional edit/delete actions based on ownership. */
export function ArticlesTable({ search, onSearchChange, articles, onDelete, onEdit }: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  function canModify(article: { author: { id?: string } }) {
    return user && (user.role === 'SUPER_ADMIN' || article.author.id === user.id);
  }

  return (
    <>
      <input value={search} onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t('admin.table.search')}
        className="mt-6 w-full max-w-md rounded border border-gray-300 px-3 py-2" />

      <table className="mt-4 w-full border border-gray-200 text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">{t('admin.table.title')}</th>
            <th className="px-4 py-3">{t('admin.table.category')}</th>
            <th className="px-4 py-3">{t('admin.table.status')}</th>
            <th className="px-4 py-3">{t('admin.table.views')}</th>
            <th className="px-4 py-3">{t('admin.table.date')}</th>
            <th className="px-4 py-3">{t('admin.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {articles?.data.map((article) => (
            <tr key={article.id} onClick={() => navigate(`/article/${article.slug}`)}
              className="cursor-pointer border-t border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium">{article.title}</td>
              <td className="px-4 py-3">{article.category.name}</td>
              <td className="px-4 py-3">
                <span className={`rounded px-2 py-1 text-xs font-semibold ${STATUS_STYLES[article.status]}`}>
                  {article.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500">{article.views.toLocaleString()}</td>
              <td className="px-4 py-3">
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '—'}
              </td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2">
                  {canModify(article) && (
                    <>
                      <button type="button" onClick={() => onEdit(article)}
                        className="text-xs font-semibold text-brand hover:underline">
                        {t('admin.table.edit')}
                      </button>
                      <button type="button" onClick={() => onDelete(article.id)}
                        aria-label={`Delete ${article.title}`}
                        className="text-xs font-semibold text-red-600 hover:underline">
                        {t('admin.table.delete')}
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {articles && (
        <p className="mt-4 text-xs text-gray-500">
          {t('admin.table.showing', { n: articles.data.length, m: articles.total.toLocaleString() })}
        </p>
      )}
    </>
  );
}
