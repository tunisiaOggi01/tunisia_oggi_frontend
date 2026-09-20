/** A user as returned by GET /users (admin view). */
export interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: string;
  imageUrl: string | null;
  createdAt: string;
}
