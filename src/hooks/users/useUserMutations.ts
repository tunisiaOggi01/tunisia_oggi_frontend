import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateUserRole as updateUserRoleRequest,
  deleteUser as deleteUserRequest,
} from '../../api/users/users.api';

/** Wraps user admin write operations and cache invalidation. */
export function useUserMutations() {
  const queryClient = useQueryClient();

  const updateUserRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => updateUserRoleRequest(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const deleteUser = useMutation({
    mutationFn: deleteUserRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  return { updateUserRole, deleteUser };
}
