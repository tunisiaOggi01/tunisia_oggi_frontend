import { useState } from 'react';
import { createPublication } from '../../../api/publications/admin.api';
import { uploadImage } from '../../../api/upload/upload.api';
import type { PublicationStatus } from '../../../api/publications/types';

/** Owns the Create Article form's field state and the image-upload/submit side effects. */
export function useCreateArticleForm(onCreated: () => void, onClose: () => void) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUrl(await uploadImage(file));
  }

  async function submit(status: PublicationStatus) {
    setIsSubmitting(true);
    try {
      await createPublication({ title, categoryId, body, featuredImageUrl: imageUrl ?? undefined, status });
      onCreated();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    title, setTitle,
    categoryId, setCategoryId,
    body, setBody,
    imageUrl,
    isSubmitting,
    canSubmit: !isSubmitting && !!title && !!categoryId,
    handleImageChange,
    submit,
  };
}
