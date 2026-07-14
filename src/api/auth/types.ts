export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: 'SUPER_ADMIN' | 'EDITOR' | 'ADVERTISER' | 'VISITOR';
  imageUrl?: string | null;
}
