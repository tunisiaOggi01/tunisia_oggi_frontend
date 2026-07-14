import { useCategories } from '../../hooks/categories/useCategories';
import { useCategoryMutations } from '../../hooks/categories/useCategoryMutations';
import { AdminSidebar } from '../../components/admin/AdminSidebar';

/** Admin CMS category management screen: table of categories with a colored dot, slug, count, and delete action. */
export function AdminCategoriesPage() {
  const { data: categories } = useCategories();
  const { deleteCategory } = useCategoryMutations();

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">Category Management</h1>
            <p className="mt-1 text-sm text-gray-500">Organize and structure the editorial hierarchy.</p>
          </div>
          <button type="button" className="rounded bg-brand px-4 py-2 text-sm text-white">
            + New Category
          </button>
        </div>

        <table className="mt-6 w-full border border-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Article Count</th>
              <th className="px-4 py-3">Actions</th>
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
                    onClick={() => deleteCategory(category.id)}
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
    </div>
  );
}
