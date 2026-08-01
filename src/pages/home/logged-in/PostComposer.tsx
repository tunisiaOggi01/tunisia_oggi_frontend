import { useRef, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCategories } from '../../../hooks/categories/useCategories';
import { useAuth } from '../../../context/AuthContext';
import { createPublication, updatePublication } from '../../../api/publications/admin.api';
import { uploadImage } from '../../../api/upload/upload.api';
import type { PublicationStatus } from '../../../api/publications/types';
import { useTranslation } from 'react-i18next';

const DEBOUNCE_MS = 2000;

/** Quick draft composer with auto-save debounce, image upload, and draft/publish actions. */
export function PostComposer() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: categories } = useCategories();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const draftIdRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const uploadPromiseRef = useRef<Promise<string> | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => { return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }; }, [previewUrl]);

  function refetchFeed() { queryClient.invalidateQueries({ queryKey: ['publications'], refetchType: 'all' }); }

  function resetForm() {
    setTitle(''); setBody(''); setImageUrl(null); setPreviewUrl(null); setCategoryId('');
    draftIdRef.current = null; setSaveState('idle');
  }

  const createMut = useMutation({
    mutationFn: (status: PublicationStatus) =>
      createPublication({ title, categoryId: categoryId || categories?.[0]?.id || '', body, featuredImageUrl: imageUrl ?? undefined, status }),
    onSuccess: (pub) => { draftIdRef.current = pub.id; setSaveState('saved'); },
    onError: () => setSaveState('idle'),
  });

  const updateMut = useMutation({
    mutationFn: () => updatePublication(draftIdRef.current!, { title, body, categoryId: categoryId || categories?.[0]?.id || '', featuredImageUrl: imageUrl ?? undefined }),
    onSuccess: () => setSaveState('saved'),
    onError: () => setSaveState('idle'),
  });

  useEffect(() => {
    if (!title.trim() && !body.trim()) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSaveState('saving');
      if (draftIdRef.current) updateMut.mutate(); else createMut.mutate('DRAFT');
    }, DEBOUNCE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [title, body, imageUrl]);

  useEffect(() => {
    if (saveState === 'saved') { const t = setTimeout(() => setSaveState('idle'), 3000); return () => clearTimeout(t); }
  }, [saveState]);

  async function handleAction(status: PublicationStatus) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSubmitting(true);
    try {
      let finalImage = imageUrl;
      if (uploadPromiseRef.current) finalImage = await uploadPromiseRef.current;
      if (draftIdRef.current) {
        await updatePublication(draftIdRef.current, { title, body, categoryId: categoryId || categories?.[0]?.id || '', featuredImageUrl: finalImage ?? undefined, status });
      } else {
        await createPublication({ title, body, categoryId: categoryId || categories?.[0]?.id || '', featuredImageUrl: finalImage ?? undefined, status });
      }
      resetForm(); refetchFeed();
      } catch (err: any) { alert(err?.message ?? t('postComposer.failedToSave')); } finally { setSubmitting(false); }
  }

  function handleImagePick() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl); setUploading(true);
    const promise = uploadImage(file);
    uploadPromiseRef.current = promise;
    promise.then((url) => { setImageUrl(url); }).catch(() => { alert(t('postComposer.failedToUpload')); })
      .finally(() => { setUploading(false); setPreviewUrl(null); uploadPromiseRef.current = null; });
  }

  const isBusy = submitting || createMut.isPending;
  const saveLabel = saveState === 'saving' ? t('postComposer.saving') : saveState === 'saved' ? t('postComposer.saved') : '';
  const displayImage = previewUrl ?? imageUrl;

  return (
    <section className="rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="material-symbols-outlined text-brand">edit_note</span>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-brand">{t('postComposer.heading')}</h2>
        {saveLabel && <span className="ml-auto text-xs text-gray-400">{saveLabel}</span>}
        {user && !saveLabel && <span className="ml-auto text-xs text-gray-400">@{user.username}</span>}
      </div>
      <div className="space-y-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder={t('postComposer.titlePlaceholder')}
          className="w-full border-none border-b border-gray-200 px-0 py-2 font-headline text-headline-md placeholder:text-gray-300 focus:border-brand focus:ring-0" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)}
          placeholder={t('postComposer.bodyPlaceholder')} rows={4}
          className="min-h-[100px] w-full resize-none border border-gray-300 px-3 py-2 text-base placeholder:text-gray-300 focus:ring-0" />
        <div className="flex flex-wrap items-center gap-3">
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-sm border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 focus:border-brand focus:ring-0">
            <option value="">{t('postComposer.category')}</option>
            {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {displayImage && (
            <div className="relative inline-flex items-center gap-1 rounded-sm bg-gray-100 px-2 py-1 text-xs text-gray-600">
              <img src={displayImage} alt="" className="h-5 w-5 rounded-sm object-cover" />
              {uploading ? t('postComposer.uploading') : t('postComposer.imageAttached')}
              <button onClick={() => { setImageUrl(null); setPreviewUrl(null); }} className="ml-1 text-gray-400 hover:text-red-600">&times;</button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-2">
          <div className="flex gap-2">
            <input type="file" accept="image/*" ref={fileRef} onChange={handleImagePick} className="hidden" />
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-50">
              <span className="material-symbols-outlined">{uploading ? 'hourglass_top' : 'image'}</span>
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleAction('DRAFT')} disabled={isBusy}
              className="px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-50">
              {isBusy ? t('postComposer.saving') : t('postComposer.saveDraft')}
            </button>
            <button onClick={() => handleAction('PUBLISHED')} disabled={isBusy}
              className="bg-brand px-6 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60">
              {isBusy ? t('postComposer.publishing') : t('postComposer.publish')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
