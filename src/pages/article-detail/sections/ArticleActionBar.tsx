import { useAuth } from '../../../context/AuthContext';
import { useAbility } from '../../../hooks/auth/useAbility';
import type { Publication } from '../../../api/publications/types';
import { useTranslation } from 'react-i18next';

interface Props {
  publication: Publication;
  reactionCount: number;
  readTime: number;
  onReaction: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

/** Author avatar, name, published date, read time, view count, share/reaction buttons. */
export function ArticleActionBar({ publication, reactionCount, readTime, onReaction, onEdit, onDelete }: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const ability = useAbility();
  const canManage = ability.can('manage', 'all');
  const isOwner = user?.id === publication.author.id;
  const showActions = canManage || (ability.can('update', 'Publication') && isOwner);

  return (
    <div className="flex items-center gap-4 border-b border-t border-gray-200 py-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-brand">
        {publication.author.username.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className="text-label-sm text-gray-900">{t('articleDetail.actionBar.publishedBy', { author: publication.author.username })}</p>
        <p className="text-caption text-gray-500">
          {t('articleDetail.actionBar.meta', { date: publication.publishedAt ? new Date(publication.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '', min: readTime, views: publication.views })}
        </p>
      </div>
      <div className="ml-auto flex gap-2">
        {showActions && (
          <>
            <button onClick={onEdit}
              className="flex items-center gap-1 rounded-sm bg-gray-100 px-3 py-2 text-xs font-semibold text-brand transition-colors hover:bg-gray-200">
              <span className="material-symbols-outlined text-[18px]">edit</span>{t('articleDetail.actionBar.edit')}
            </button>
            <button onClick={onDelete}
              className="flex items-center gap-1 rounded-sm bg-gray-100 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50">
              <span className="material-symbols-outlined text-[18px]">delete</span>{t('articleDetail.actionBar.delete')}
            </button>
          </>
        )}
        <button className="material-symbols-outlined rounded-full p-2 text-gray-500 transition-all hover:bg-gray-100">share</button>
        <button onClick={onReaction}
          className={`flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold transition-all ${publication.userReaction ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-100'}`}>
          <span className="material-symbols-outlined text-[18px]">{publication.userReaction ? 'favorite' : 'favorite_border'}</span>
          {reactionCount}
        </button>
      </div>
    </div>
  );
}
