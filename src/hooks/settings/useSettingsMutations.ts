import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeUsername, changeEmail, changePassword } from '../../api/auth/auth.api';

/** Mutation hook for changing the current user's username. */
export function useChangeUsername() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (username: string) => changeUsername(username),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['auth', 'me'] }),
  });
}

/** Mutation hook for changing the current user's email. */
export function useChangeEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => changeEmail(email),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['auth', 'me'] }),
  });
}

/** Mutation hook for changing the current user's password. */
export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      changePassword(currentPassword, newPassword),
  });
}
