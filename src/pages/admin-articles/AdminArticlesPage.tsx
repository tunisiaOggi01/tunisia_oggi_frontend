import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdminArticles } from '../../hooks/publications/useAdminArticles';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { CreateArticleModal } from '../../components/modals/create-article/CreateArticleModal';
import { ArticlesStatsRow } from './sections/ArticlesStatsRow';
import { ArticlesTable } from './sections/ArticlesTable';
import type { Publication } from '../../api/publications/types';

/** Admin CMS article management screen: composes sidebar, stats, table, create/edit modal. */
export function AdminArticlesPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Publication | null>(null);
  const [search, setSearch] = useState('');
  const { stats, articles, handleDelete, refetch } = useAdminArticles(search);

  useEffect(() => {
    const article = (location.state as any)?.editArticle as Publication | undefined;
    if (article) {
      setEditingArticle(article);
      setIsModalOpen(true);
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  function openCreate() {
    setEditingArticle(null);
    setIsModalOpen(true);
  }

  function openEdit(article: Publication) {
    setEditingArticle(article);
    setIsModalOpen(true);
  }

  function closeModal() {
    setEditingArticle(null);
    setIsModalOpen(false);
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">{t('admin.articles.pageTitle')}</h1>
            <p className="mt-1 text-sm text-gray-500">{t('admin.articles.pageSubtitle')}</p>
          </div>
          <button type="button" onClick={openCreate} className="rounded bg-brand px-4 py-2 text-sm text-white">
            {t('admin.articles.newArticle')}
          </button>
        </div>

        <ArticlesStatsRow stats={stats} />
        <ArticlesTable search={search} onSearchChange={setSearch} articles={articles} onDelete={handleDelete} onEdit={openEdit} />
      </div>

      <CreateArticleModal isOpen={isModalOpen} onClose={closeModal} onCreated={refetch} editArticle={editingArticle} />
    </div>
  );
}
