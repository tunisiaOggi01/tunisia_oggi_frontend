import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchComments, createComment, updateComment, deleteComment } from '../../api/comments/comments.api';

export function useComments(publicationId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['comments', publicationId],
    queryFn: () => fetchComments(publicationId!),
    enabled: !!publicationId,
  });

  const addMut = useMutation({
    mutationFn: ({ body, parentId }: { body: string; parentId?: string }) =>
      createComment(publicationId!, body, parentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', publicationId] }),
  });

  const editMut = useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }) => updateComment(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', publicationId] }),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', publicationId] }),
  });

  return { comments: query.data, isLoading: query.isLoading, add: addMut.mutate, update: editMut.mutate, remove: delMut.mutate, isAdding: addMut.isPending };
}
