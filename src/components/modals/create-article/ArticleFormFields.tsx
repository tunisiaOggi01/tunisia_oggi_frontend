import { useCategories } from '../../../hooks/categories/useCategories';
import type { useCreateArticleForm } from './useCreateArticleForm';

type FormState = ReturnType<typeof useCreateArticleForm>;

/** Renders the modal's title/category/image/content fields. Purely presentational — all state lives in the form hook. */
export function ArticleFormFields(form: FormState) {
  const { data: categories } = useCategories();

  return (
    <>
      <label htmlFor="article-title" className="block text-xs font-semibold uppercase text-gray-500">
        Article Title
      </label>
      <input
        id="article-title"
        value={form.title}
        onChange={(e) => form.setTitle(e.target.value)}
        placeholder="Enter a compelling headline..."
        className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
      />

      <label htmlFor="article-category" className="mt-4 block text-xs font-semibold uppercase text-gray-500">
        Category
      </label>
      <select
        id="article-category"
        value={form.categoryId}
        onChange={(e) => form.setCategoryId(e.target.value)}
        className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
      >
        <option value="">Select a category</option>
        {categories?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <label className="mt-4 block text-xs font-semibold uppercase text-gray-500">Featured Image</label>
      <div className="mt-1 rounded border-2 border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        <input type="file" accept="image/*" onChange={form.handleImageChange} />
        {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="mt-2 h-24 rounded object-cover" />}
      </div>

      <label className="mt-4 block text-xs font-semibold uppercase text-gray-500">Content</label>
      <div className="mt-1 flex gap-2 border border-b-0 border-gray-300 bg-gray-50 px-2 py-1 text-sm text-gray-400">
        <span>B</span>
        <span>I</span>
        <span>≡</span>
        <span>🔗</span>
        <span>"</span>
      </div>
      <textarea
        value={form.body}
        onChange={(e) => form.setBody(e.target.value)}
        placeholder="Start writing your story..."
        rows={6}
        className="w-full rounded-b border border-gray-300 px-3 py-2"
      />
    </>
  );
}
