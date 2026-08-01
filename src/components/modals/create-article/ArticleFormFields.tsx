import { useTranslation } from 'react-i18next';
import { useCategories } from '../../../hooks/categories/useCategories';
import type { useCreateArticleForm } from './useCreateArticleForm';
import type { UploadStatus } from './useCreateArticleForm';

type FormState = ReturnType<typeof useCreateArticleForm>;

function uploadLabels(t: (key: string) => string): Record<UploadStatus, string> {
  return {
    idle: t('components.articleForm.uploading'),
    uploading: t('components.articleForm.uploading'),
    done: t('components.articleForm.uploadComplete'),
    error: t('components.articleForm.uploadFailed'),
  };
}

/** Renders the modal's title/category/image/content fields with plain text body. */
export function ArticleFormFields(form: FormState) {
  const { t } = useTranslation();
  const labels = uploadLabels(t);
  const { data: categories } = useCategories();

  return (
    <>
      <label htmlFor="article-title" className="block text-xs font-semibold uppercase text-gray-500">{t('components.articleForm.title')}</label>
      <input id="article-title" value={form.title} onChange={(e) => form.setTitle(e.target.value)}
        placeholder={t('components.articleForm.titlePlaceholder')}
        className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />

      <label htmlFor="article-category" className="mt-4 block text-xs font-semibold uppercase text-gray-500">{t('components.articleForm.category')}</label>
      <select id="article-category" value={form.categoryId} onChange={(e) => form.setCategoryId(e.target.value)}
        className="mt-1 w-full rounded border border-gray-300 px-3 py-2">
        <option value="">{t('components.articleForm.selectCategory')}</option>
        {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <label className="mt-4 block text-xs font-semibold uppercase text-gray-500">{t('components.articleForm.featuredImage')}</label>
      <div className="mt-1 rounded border-2 border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        <input type="file" accept="image/*" onChange={form.handleImageChange} />
        {form.uploadStatus === 'uploading' && <p className="mt-2 text-xs text-blue-500 animate-pulse">{labels.uploading}</p>}
        {form.uploadStatus === 'error' && <p className="mt-2 text-xs text-red-500">{labels.error}</p>}
        {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="mt-2 h-24 rounded object-cover" />}
      </div>

      <label className="mt-4 block text-xs font-semibold uppercase text-gray-500">{t('components.articleForm.content')}</label>
      <textarea value={form.body} onChange={(e) => form.setBody(e.target.value)}
        placeholder={t('components.articleForm.contentPlaceholder')} rows={6}
        className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
    </>
  );
}
