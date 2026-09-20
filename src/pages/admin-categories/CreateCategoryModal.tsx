import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCategoryMutations } from '../../hooks/categories/useCategoryMutations';

/** Create-category modal — name, auto-generated slug, optional description & color. */
export function CreateCategoryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { createCategory } = useCategoryMutations();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#8B1E1E');
  const [slugEdited, setSlugEdited] = useState(false);

  if (!isOpen) return null;

  function toSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setName(value);
    if (!slugEdited) setSlug(toSlug(value));
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugEdited(true);
    setSlug(e.target.value);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createCategory.mutateAsync({ name, slug, description: description || undefined, color });
    setName('');
    setSlug('');
    setDescription('');
    setColor('#8B1E1E');
    setSlugEdited(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={onSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-gray-200 bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold">{t('admin.categories.createTitle')}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <label className="block text-sm font-medium text-gray-700">
          {t('admin.categories.name')}
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            required
            maxLength={50}
            className="mt-1 block w-full border border-gray-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="mt-3 block text-sm font-medium text-gray-700">
          {t('admin.categories.slug')}
          <input
            type="text"
            value={slug}
            onChange={handleSlugChange}
            required
            pattern="^[a-z0-9-]+$"
            className="mt-1 block w-full border border-gray-300 px-3 py-2 font-mono text-sm"
          />
        </label>

        <label className="mt-3 block text-sm font-medium text-gray-700">
          {t('admin.categories.description')}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full border border-gray-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="mt-3 block text-sm font-medium text-gray-700">
          {t('admin.categories.color')}
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-8 cursor-pointer border border-gray-300"
            />
            <span className="font-mono text-xs text-gray-500">{color}</span>
          </div>
        </label>

        {createCategory.isError && (
          <p className="mt-3 text-sm text-red-600">{t('admin.categories.createFailed')}</p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="border border-gray-300 px-4 py-2 text-sm">
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={createCategory.isPending}
            className="rounded bg-brand px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {createCategory.isPending ? t('common.saving') : t('admin.categories.create')}
          </button>
        </div>
      </form>
    </div>
  );
}
