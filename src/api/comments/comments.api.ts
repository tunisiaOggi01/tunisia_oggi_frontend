import { apiClient } from '../client';
import type { Comment } from './types';

export async function fetchComments(publicationId: string): Promise<Comment[]> {
  const res = await apiClient.get(`/publications/${publicationId}/comments`);
  return res.data;
}

export async function createComment(publicationId: string, body: string, parentId?: string): Promise<Comment> {
  const res = await apiClient.post(`/publications/${publicationId}/comments`, { body, parentId });
  return res.data;
}

export async function updateComment(id: string, body: string): Promise<Comment> {
  const res = await apiClient.patch(`/comments/${id}`, { body });
  return res.data;
}

export async function deleteComment(id: string): Promise<void> {
  await apiClient.delete(`/comments/${id}`);
}
