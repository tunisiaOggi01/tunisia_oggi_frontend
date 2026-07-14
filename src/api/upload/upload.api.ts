import { apiClient } from '../client';

/** POST /upload/image — uploads a File to Cloudinary via the backend, returns the resulting URL. */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiClient.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.url;
}
