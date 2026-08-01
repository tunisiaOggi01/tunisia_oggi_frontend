import { useState } from 'react';
import { useCreateArticleForm } from './useCreateArticleForm';
import { ArticleFormFields } from './ArticleFormFields';
import { useTranslation } from 'react-i18next';
import type { Publication } from '../../../api/publications/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  editArticle?: Publication | null;
}

/** Modal shell with form editing and a live preview toggle. Supports create and edit modes. */
export function CreateArticleModal({ isOpen, onClose, onCreated, editArticle }: Props) {
  const { t } = useTranslation();
  const editData = editArticle ? {
    id: editArticle.id,
    title: editArticle.title,
    categoryId: editArticle.category.id,
    body: editArticle.body,
    featuredImageUrl: editArticle.featuredImageUrl,
  } : undefined;

  const form = useCreateArticleForm(onCreated, onClose, editData);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`w-full rounded bg-white p-6 ${showPreview ? 'max-w-2xl' : 'max-w-lg'}`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold">
            {showPreview ? t('components.createArticleModal.preview') : form.isEditing ? t('components.createArticleModal.editArticle') : t('components.createArticleModal.createNewArticle')}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {showPreview ? (
          <div className="max-h-[70vh] overflow-y-auto">
            {form.imageUrl && (
              <img src={form.imageUrl} alt="" className="mb-4 aspect-[16/9] w-full rounded object-cover" />
            )}
            <p className="text-xs font-semibold uppercase text-brand">
              {form.categoryId || 'Uncategorized'}
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold text-gray-900">
              {form.title || t('components.createArticleModal.untitled')}
            </h1>
            <div className="prose mt-6 max-w-none whitespace-pre-line text-gray-800">
              {form.body || t('components.createArticleModal.noContent')}
            </div>
          </div>
        ) : (
          <ArticleFormFields {...form} />
        )}

        <div className="mt-6 flex justify-between">
          {showPreview ? (
            <button type="button" onClick={() => setShowPreview(false)} className="text-sm text-gray-600">
              {t('components.createArticleModal.backToEdit')}
            </button>
          ) : (
            <button type="button" onClick={onClose} className="text-sm text-gray-600">
              {t('components.createArticleModal.cancel')}
            </button>
          )}
          {!showPreview && (
            <div className="flex gap-2">
              <button type="button" disabled={!form.canSubmit} onClick={() => setShowPreview(true)}
                className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-600 disabled:opacity-50">
                {t('components.createArticleModal.previewBtn')}
              </button>
              <button type="button" disabled={!form.canSubmit} onClick={() => form.submit('DRAFT')}
                className="rounded border border-brand px-4 py-2 text-sm text-brand disabled:opacity-50">
                {t('components.createArticleModal.saveDraft')}
              </button>
              <button type="button" disabled={!form.canSubmit} onClick={() => form.submit('PUBLISHED')}
                className="rounded bg-brand px-4 py-2 text-sm text-white disabled:opacity-50">
                {t('components.createArticleModal.publishNow')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
