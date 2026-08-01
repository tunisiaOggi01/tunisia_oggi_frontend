import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/** Simple admin dashboard — landing page for SUPER_ADMIN users after login. */
export function AdminDashboardPage() {
  const { t } = useTranslation();
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-gray-800">{t('admin.dashboard.pageTitle')}</h1>
      <p className="mt-2 text-sm text-gray-500">{t('admin.dashboard.pageSubtitle')}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Link to="/admin/articles"
          className="rounded-sm border border-gray-200 p-6 transition-all hover:border-brand hover:shadow-sm"
        >
          <span className="material-symbols-outlined text-3xl text-brand">article</span>
          <h2 className="mt-3 font-serif text-lg font-bold text-gray-800">{t('admin.dashboard.articles')}</h2>
          <p className="mt-1 text-sm text-gray-500">{t('admin.dashboard.articlesDesc')}</p>
        </Link>
        <Link to="/admin/categories"
          className="rounded-sm border border-gray-200 p-6 transition-all hover:border-brand hover:shadow-sm"
        >
          <span className="material-symbols-outlined text-3xl text-brand">category</span>
          <h2 className="mt-3 font-serif text-lg font-bold text-gray-800">{t('admin.dashboard.categories')}</h2>
          <p className="mt-1 text-sm text-gray-500">{t('admin.dashboard.categoriesDesc')}</p>
        </Link>
      </div>
    </main>
  );
}
