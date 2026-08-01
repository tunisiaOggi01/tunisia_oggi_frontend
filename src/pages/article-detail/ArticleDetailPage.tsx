import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useArticleDetail } from '../../hooks/publications/useArticleDetail';
import { deletePublication } from '../../api/publications/admin.api';
import { ArticleDetailSkeleton } from './ArticleDetailSkeleton';
import { CreateArticleModal } from '../../components/modals/create-article/CreateArticleModal';
import { ArticleActionBar } from './sections/ArticleActionBar';
import { ArticleBody } from './sections/ArticleBody';
import { ArticleSidebar } from './sections/ArticleSidebar';
import { CommentSection } from '../../components/comments/CommentSection';
import type { Publication } from '../../api/publications/types';
import { useTranslation } from 'react-i18next';

/** Full article view matching the editorial design: breadcrumb, hero, body, sidebar, related. */
export function ArticleDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { publication, related, isLoading, react, unreact, isReacting } = useArticleDetail(slug);
  const [editArticle, setEditArticle] = useState<Publication | null>(null);

  if (isLoading) return <ArticleDetailSkeleton />;
  if (!publication) return <div className="p-8 text-center text-gray-500">{t('articleDetail.notFound')}</div>;

  const pub = publication;
  const readTime = Math.max(1, Math.ceil(pub.body.split(' ').length / 200));
  const mostRead = [...(related ?? [])].sort((a, b) => b.views - a.views).slice(0, 3);

  function handleReaction() {
    if (!user) return navigate('/admin/login');
    if (isReacting) return;
    if (pub.userReaction) unreact(); else react('LIKE');
  }

  async function handleDelete() {
    if (!confirm(t('articleDetail.confirmDelete'))) return;
    await deletePublication(pub.id);
    navigate('/');
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-label-sm text-gray-500">
        <Link to="/" className="hover:text-brand transition-colors">{t('articleDetail.home')}</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link to={`/category/${pub.category.slug}`} className="hover:text-brand transition-colors">{pub.category.name}</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="font-bold text-brand">{t('articleDetail.article')}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <article className="lg:col-span-8">
          <header className="mb-8">
            <span className="mb-4 block text-label-sm uppercase tracking-widest text-brand">{pub.category.name}</span>
            <h1 className="mb-6 font-headline text-headline-lg-mobile leading-tight md:text-headline-lg text-gray-900">{pub.title}</h1>
            <ArticleActionBar publication={pub} reactionCount={pub.reactionCount ?? 0} readTime={readTime}
              onReaction={handleReaction} onEdit={() => setEditArticle(publication)} onDelete={handleDelete} />
          </header>
          {pub.featuredImageUrl && (
            <figure className="mb-8">
              <img src={pub.featuredImageUrl} alt="" className="aspect-video w-full object-cover" />
              <figcaption className="mt-3 border-l-2 border-brand pl-4 text-caption italic text-gray-500">
                {t('articleDetail.imageCaption', { category: pub.category.name })}
              </figcaption>
            </figure>
          )}
          <ArticleBody publication={pub} />
          <CommentSection publicationId={pub.id} />
        </article>
        <ArticleSidebar mostRead={mostRead} />
      </div>

      {related && related.length > 0 && (
        <section className="mt-12 border-t-4 border-gray-900 pt-8">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-headline text-headline-md text-gray-900">{t('articleDetail.relatedArticles')}</h2>
            <Link to={`/category/${pub.category.slug}`} className="text-label-sm text-brand hover:underline">{t('articleDetail.viewAllInCategory', { category: pub.category.name })}</Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {related.map((article) => (
              <Link key={article.id} to={`/article/${article.slug}`} className="group cursor-pointer">
                {article.featuredImageUrl && <div className="mb-4 aspect-[4/3] overflow-hidden">
                  <img src={article.featuredImageUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>}
                <span className="mb-2 block text-label-sm uppercase text-brand">{article.category.name}</span>
                <h3 className="font-headline text-[20px] leading-tight text-gray-900 transition-colors group-hover:text-brand">{article.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CreateArticleModal isOpen={!!editArticle} onClose={() => setEditArticle(null)}
        onCreated={() => queryClient.refetchQueries({ queryKey: ['publications', 'detail', slug] })} editArticle={editArticle} />
    </main>
  );
}
