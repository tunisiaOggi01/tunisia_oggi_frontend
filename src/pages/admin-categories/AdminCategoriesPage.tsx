import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../../hooks/categories/useCategories';
import { useCategoryMutations } from '../../hooks/categories/useCategoryMutations';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { CreateCategoryModal } from './CreateCategoryModal';

/** Admin CMS category management screen: table of categories with a colored dot, slug, count, and delete action. */
export function AdminCategoriesPage() {
  const { t } = useTranslation();
  const { data: categories } = useCategories();
  const { deleteCategory } = useCategoryMutations();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteCategory.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">{t('admin.categories.pageTitle')}</h1>
            <p className="mt-1 text-sm text-gray-500">{t('admin.categories.pageSubtitle')}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="rounded bg-brand px-4 py-2 text-sm text-white"
          >
            {t('admin.categories.newCategory')}
          </button>
        </div>

        <table className="mt-6 w-full border border-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">{t('admin.categories.name')}</th>
              <th className="px-4 py-3">{t('admin.categories.slug')}</th>
              <th className="px-4 py-3">{t('admin.categories.articleCount')}</th>
              <th className="px-4 py-3">{t('admin.categories.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category) => (
              <tr key={category.id} className="border-t border-gray-100">
                <td className="px-4 py-3">
                  <span
                    className="mr-2 inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">/{category.slug}</td>
                <td className="px-4 py-3">
                  <span className="rounded bg-gray-100 px-2 py-1">{category.articleCount.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: category.id, name: category.name })}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Delete ${category.name}`}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateCategoryModal isOpen={showCreate} onClose={() => setShowCreate(false)} />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md border border-gray-200 bg-white p-6">
            <h2 className="font-serif text-xl font-bold">{t('admin.categories.confirmTitle')}</h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('admin.categories.confirmMessage', { name: deleteTarget.name })}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="border border-gray-300 px-4 py-2 text-sm"
              >
                {t('admin.categories.confirmNo')}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                {t('admin.categories.confirmYes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
