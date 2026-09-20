import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUsers } from '../../hooks/users/useUsers';
import { useUserMutations } from '../../hooks/users/useUserMutations';
import { AdminSidebar } from '../../components/admin/AdminSidebar';

const ROLES = ['SUPER_ADMIN', 'EDITOR', 'ADVERTISER', 'VISITOR'] as const;

/** Admin user management screen: table of users with role dropdown and delete action. */
export function AdminUsersPage() {
  const { t } = useTranslation();
  const { data: users } = useUsers();
  const { updateUserRole, deleteUser } = useUserMutations();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; username: string } | null>(null);

  function handleRoleChange(id: string, role: string) {
    updateUserRole.mutate({ id, role });
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteUser.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div>
          <h1 className="font-serif text-3xl font-bold">{t('admin.users.pageTitle')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('admin.users.pageSubtitle')}</p>
        </div>

        <table className="mt-6 w-full border border-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">{t('admin.users.colUsername')}</th>
              <th className="px-4 py-3">{t('admin.users.colEmail')}</th>
              <th className="px-4 py-3">{t('admin.users.colRole')}</th>
              <th className="px-4 py-3">{t('admin.users.colJoined')}</th>
              <th className="px-4 py-3">{t('admin.users.colActions')}</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{user.username}</td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border border-gray-200 px-2 py-1 text-sm"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: user.id, username: user.username })}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Delete ${user.username}`}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md border border-gray-200 bg-white p-6">
            <h2 className="font-serif text-xl font-bold">{t('admin.users.confirmTitle')}</h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('admin.users.confirmMessage', { name: deleteTarget.username })}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="border border-gray-300 px-4 py-2 text-sm"
              >
                {t('admin.users.confirmNo')}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                {t('admin.users.confirmYes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
