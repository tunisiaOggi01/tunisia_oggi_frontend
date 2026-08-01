import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { uploadImage } from '../../api/upload/upload.api';
import { updateProfile } from '../../api/auth/auth.api';
import { useAuth } from '../../context/AuthContext';

/** Profile completion: circular photo upload + description. Required after registration. */
export function AdminCompleteProfilePage() {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(user?.imageUrl ?? '');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const adminPath = user?.role === 'SUPER_ADMIN' ? '/admin' : '/';

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch {
      setError(t('admin.completeProfile.uploadFailed'));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await updateProfile({ imageUrl: imageUrl || undefined, description });
      await refreshUser();
      navigate(adminPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.completeProfile.failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(110vh-4rem)] flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 items-end bg-cover bg-center p-8"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=1200')` }}
      >
        <div className="text-white">
          <h2 className="font-serif text-4xl font-bold leading-tight drop-shadow-md">{t('admin.completeProfile.heroHeading')}</h2>
          <p className="mt-2 text-lg italic opacity-90 drop-shadow-sm">{t('admin.completeProfile.heroSubtitle')}</p>
        </div>
      </div>
      <div className="flex w-full items-center justify-center bg-gray-50 px-4 py-8 md:w-1/2 md:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 h-[3px] w-full rounded-full opacity-60"
            style={{ background: 'linear-gradient(to right, #008C45 33.33%, #F4F5F0 33.33%, #F4F5F0 66.66%, #CD212A 66.66%)' }}
          />
          <div className="mb-8 text-center md:text-left">
            <h1 className="font-serif text-4xl font-bold uppercase tracking-tighter text-brand">{t('nav.logo')}</h1>
            <p className="mt-1 inline-block border-b border-gray-300 pb-4 text-[11px] font-semibold uppercase tracking-widest text-gray-500">{t('admin.completeProfile.completeProfile')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col items-center gap-2">
              <input type="file" accept="image/*" ref={fileRef} onChange={handleImageChange} className="hidden" />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-100 transition-all hover:border-brand disabled:opacity-60">
                {imageUrl ? (
                  <img src={imageUrl} alt="" className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                  </span>
                )}
                {uploading && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                  </span>
                )}
              </button>
              <span className="text-xs text-gray-500">{t('admin.completeProfile.uploadPhoto')}</span>
            </div>
            <div className="space-y-2">
              <label htmlFor="cp-desc" className="block text-sm font-semibold text-gray-600">{t('admin.completeProfile.aboutYou')}</label>
              <textarea id="cp-desc" value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder={t('admin.completeProfile.aboutYouPlaceholder')} rows={4}
                className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 resize-none" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading || uploading}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-brand px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-dark disabled:opacity-60 active:scale-[0.98]">
              {loading ? t('admin.completeProfile.saving') : t('admin.completeProfile.submit')}
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to={adminPath} className="text-xs font-semibold text-gray-500 hover:text-brand">{t('admin.completeProfile.skip')}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
