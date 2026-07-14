import type { PaginatedPublications } from '../../api/publications/types';

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
}

/** Search bar + article table (title/category/status badge/date/delete action) + pagination summary. */
export function ArticlesTable({ search, onSearchChange, articles, onDelete }: Props) {
  return (
    <>
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search articles..."
        className="mt-6 w-full max-w-md rounded border border-gray-300 px-3 py-2"
      />

      <table className="mt-4 w-full border border-gray-200 text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles?.data.map((article) => (
            <tr key={article.id} className="border-t border-gray-100">
              <td className="px-4 py-3 font-medium">{article.title}</td>
              <td className="px-4 py-3">{article.category.name}</td>
              <td className="px-4 py-3">
                <span className={`rounded px-2 py-1 text-xs font-semibold ${STATUS_STYLES[article.status]}`}>
                  {article.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '—'}
              </td>
              <td className="px-4 py-3">
                <button type="button" onClick={() => onDelete(article.id)} aria-label={`Delete ${article.title}`}>
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {articles && (
        <p className="mt-4 text-xs text-gray-500">
          Showing {articles.data.length} of {articles.total.toLocaleString()} articles
        </p>
      )}
    </>
  );
}
