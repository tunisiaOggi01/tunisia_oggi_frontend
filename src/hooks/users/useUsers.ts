import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../../api/users/users.api';

/** Fetches all users for the admin user management table. */
export function useUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchUsers,
  });
}
