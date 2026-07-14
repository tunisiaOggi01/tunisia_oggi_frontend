import { useState } from 'react';
import { useAdminArticles } from '../../hooks/publications/useAdminArticles';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { CreateArticleModal } from '../../components/modals/create-article/CreateArticleModal';
import { ArticlesStatsRow } from './ArticlesStatsRow';
import { ArticlesTable } from './ArticlesTable';

/** Admin CMS article management screen: composes the sidebar, stats row, table, and create-article modal. */
export function AdminArticlesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { stats, articles, handleDelete, refetch } = useAdminArticles(search);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">Article Management</h1>
            <p className="mt-1 text-sm text-gray-500">Review, edit, and publish the latest reportage.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded bg-brand px-4 py-2 text-sm text-white"
          >
            + New Article
          </button>
        </div>

        <ArticlesStatsRow stats={stats} />
        <ArticlesTable search={search} onSearchChange={setSearch} articles={articles} onDelete={handleDelete} />
      </div>

      <CreateArticleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreated={refetch} />
    </div>
  );
}
