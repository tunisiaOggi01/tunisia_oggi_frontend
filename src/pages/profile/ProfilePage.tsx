import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../api/auth/auth.api';
import { useMyPublications } from '../../hooks/publications/useAdminArticles';

type Tab = 'articles' | 'reacted';

/** Profile page with user info form and activity feed (my articles / reacted). */
export function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { user, refreshUser } = useAuth();
  const { data: pubsData } = useMyPublications();
  const articles = (pubsData?.data ?? []).filter((a) => a.status === 'PUBLISHED');
  const [tab, setTab] = useState<Tab>('articles');
  const [description, setDescription] = useState(user?.description ?? '');
  const [saving, setSaving] = useState(false);

  if (!user) return <Navigate to={`/admin/login?redirect=${encodeURIComponent('/profile')}`} replace />;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await updateProfile({ description }); await refreshUser(); }
    catch { alert(t('profile.failedToSave')); }
    finally { setSaving(false); }
  }

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language === 'fr' ? 'fr-FR' : 'it-IT',
      { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <section className="relative overflow-hidden border border-gray-200 bg-white p-6">
            <div className="mb-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div className="relative group">
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt="" className="h-28 w-28 border border-gray-200 object-cover" />
                ) : (
                  <span className="flex h-28 w-28 items-center justify-center border border-gray-200 bg-gray-100 text-3xl font-bold text-brand">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="pt-2 text-center sm:text-left">
                <h1 className="font-headline text-headline-md text-gray-900">{user.username}</h1>
                <p className="text-sm font-semibold text-gray-500">{user.role.replace('_', ' ')}</p>
                <div className="mt-2 flex justify-center gap-2 sm:justify-start">
                  <span className="rounded-sm bg-red-50 px-2 py-0.5 text-xs font-bold text-brand">{t('profile.staff')}</span>
                  <span className="rounded-sm bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-800">{t('profile.verified')}</span>
                </div>
              </div>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('profile.fullName')}</label>
                <input value={user.username} disabled
                  className="w-full border border-gray-300 bg-gray-50 p-3 text-sm text-gray-500" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('profile.professionalBio')}</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full resize-none border border-gray-300 p-3 text-sm" rows={4} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('profile.emailAddress')}</label>
                <input value={user.email} disabled
                  className="w-full border border-gray-300 bg-gray-50 p-3 text-sm text-gray-500" />
              </div>
              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <button type="submit" disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 bg-brand py-3 text-sm font-semibold text-white transition-all hover:brightness-110">
                  <span className="material-symbols-outlined text-sm">save</span>
                  {saving ? t('profile.saving') : t('profile.saveChanges')}
                </button>
                <button type="button"
                  className="flex flex-1 items-center justify-center gap-2 border border-gray-300 py-3 text-sm font-semibold text-brand transition-all hover:bg-gray-50">
                  <span className="material-symbols-outlined text-sm">lock_reset</span>
                  {t('profile.changePassword')}
                </button>
              </div>
            </form>
          </section>
        </div>

        <div className="lg:col-span-7">
          <div className="flex min-h-[600px] flex-col border border-gray-200 bg-white">
            <div className="flex border-b border-gray-200">
              <button onClick={() => setTab('articles')}
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-widest transition-all ${
                  tab === 'articles' ? 'border-b-2 border-brand font-bold text-brand' : 'text-gray-500 hover:text-brand'
                }`}>{t('profile.myArticles')}</button>
              <button onClick={() => setTab('reacted')}
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-widest transition-all ${
                  tab === 'reacted' ? 'border-b-2 border-brand font-bold text-brand' : 'text-gray-500 hover:text-brand'
                }`}>{t('profile.reacted')}</button>
            </div>

            {tab === 'articles' ? (
              <div className="space-y-4 p-6">
                {articles.length === 0 && <p className="py-12 text-center text-sm text-gray-400">{t('profile.noArticles')}</p>}
                {articles.map((a) => (
                  <div key={a.id} className="group flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0">
                    {a.featuredImageUrl && (
                      <div className="h-20 w-20 shrink-0 bg-gray-100">
                        <img src={a.featuredImageUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="mb-1 flex items-start justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand">{a.category.name}</span>
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">PUBLISHED</span>
                      </div>
                      <Link to={`/article/${a.slug}`}
                        className="font-headline text-base leading-tight transition-colors group-hover:text-brand">{a.title}</Link>
                      <p className="text-xs text-gray-500">
                        {a.publishedAt
                          ? t('profile.published', { date: fmtDate(a.publishedAt) })
                          : t('profile.lastEdited', { date: fmtDate(a.createdAt) })}
                        {a.status === 'PUBLISHED' && ` • ${t('profile.reads', { n: a.views.toLocaleString() })}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <span className="material-symbols-outlined text-6xl">history</span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest">{t('profile.noInteractions')}</p>
                <p className="mt-2 text-xs text-gray-500">{t('profile.interactionsDesc')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
