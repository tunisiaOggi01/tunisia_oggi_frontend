import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { updateProfile } from '../../../api/auth/auth.api';
import { uploadImage } from '../../../api/upload/upload.api';

/** Profile settings: avatar upload + bio editing. */
export function ProfileSection() {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(user?.imageUrl ?? '');
  const [description, setDescription] = useState(user?.description ?? '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile({ imageUrl: imageUrl || undefined, description });
      await refreshUser();
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <input type="file" accept="image/*" ref={fileRef} onChange={handleImageChange} className="hidden" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-100 transition-all hover:border-brand disabled:opacity-60"
        >
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-gray-400">
              <span className="material-symbols-outlined text-2xl">add_a_photo</span>
            </span>
          )}
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
              <span className="material-symbols-outlined animate-spin text-xl">refresh</span>
            </span>
          )}
        </button>
        <div>
          <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
          <p className="text-xs text-gray-500">{t('settings.profile.uploadHint')}</p>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">{t('settings.profile.bio')}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder={t('settings.profile.bioPlaceholder')}
          className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 resize-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-sm bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? t('settings.profile.saving') : t('settings.profile.save')}
        </button>
        {saved && <span className="text-sm text-green-600">{t('settings.profile.saved')}</span>}
      </div>
    </div>
  );
}
