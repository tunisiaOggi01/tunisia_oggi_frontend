import { useState, useEffect, useRef } from 'react';
import { createPublication, updatePublication } from '../../../api/publications/admin.api';
import { uploadImage } from '../../../api/upload/upload.api';
import { useTranslation } from 'react-i18next';
import type { PublicationStatus } from '../../../api/publications/types';

interface EditArticle {
  id: string;
  title: string;
  categoryId: string;
  body: string;
  featuredImageUrl: string | null;
}

export type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

const DEBOUNCE_MS = 2000;

/** Owns the Article form's field state, image-upload, and auto-save draft. Auto-saves as DRAFT after 2s idle. */
export function useCreateArticleForm(onCreated: () => void, onClose: () => void, editArticle?: EditArticle) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(editArticle?.id ?? null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const uploadPromiseRef = useRef<Promise<string | null> | null>(null);

  useEffect(() => {
    if (!editArticle) return;
    setTitle(editArticle.title);
    setCategoryId(editArticle.categoryId);
    setBody(editArticle.body);
    setImageUrl(editArticle.featuredImageUrl);
  }, [editArticle?.id]);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  /** Auto-save draft on idle. Requires title and categoryId. */
  useEffect(() => {
    if (!title.trim() || !categoryId) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const payload = { title, categoryId, body, featuredImageUrl: imageUrl ?? undefined };
      if (draftId) {
        updatePublication(draftId, payload).catch(() => {});
      } else {
        createPublication({ ...payload, status: 'DRAFT' }).then((p) => setDraftId(p.id)).catch(() => {});
      }
    }, DEBOUNCE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [title, body, imageUrl, categoryId]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploadStatus('uploading');
    const promise = uploadImage(file);
    uploadPromiseRef.current = promise;
    promise.then((url) => { setImageUrl(url); setUploadStatus('done'); })
      .catch(() => { setUploadStatus('error'); })
      .finally(() => { setPreviewUrl(null); uploadPromiseRef.current = null; });
  }

  async function submit(status: PublicationStatus) {
    setIsSubmitting(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    try {
      let finalImage = imageUrl;
      if (uploadPromiseRef.current) finalImage = await uploadPromiseRef.current;
      const payload = { title, categoryId, body, featuredImageUrl: finalImage ?? undefined, status };
      if (draftId) { await updatePublication(draftId, payload); } else { await createPublication(payload); }
      onCreated();
      onClose();
    } catch (err: any) {
      alert(err?.message ?? t('common.failedToSave'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    title, setTitle, categoryId, setCategoryId, body, setBody,
    imageUrl: previewUrl ?? imageUrl, uploadStatus, isSubmitting, isEditing: !!editArticle,
    canSubmit: !isSubmitting && !!title && !!categoryId, handleImageChange, submit,
  };
}
