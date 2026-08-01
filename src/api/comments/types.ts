export interface Comment {
  id: string;
  body: string;
  userId: string;
  publicationId: string;
  parentId: string | null;
  createdAt: string;
  user: { id: string; username: string; imageUrl: string | null };
  replies?: Comment[];
}
