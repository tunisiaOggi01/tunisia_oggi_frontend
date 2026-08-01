import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { CommentForm } from './CommentForm';
import type { Comment } from '../../api/comments/types';

interface Props {
  comment: Comment;
  onReply: (body: string, parentId: string) => void;
  onEdit?: (id: string, body: string) => void;
  onDelete: (id: string) => void;
  isAdding: boolean;
}

export function CommentItem({ comment, onReply, onEdit, onDelete, isAdding }: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showReply, setShowReply] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);

  function handleReply(body: string) {
    onReply(body, comment.id);
    setShowReply(false);
  }

  const canModify = user && (user.role === 'SUPER_ADMIN' || user.id === comment.userId);

  return (
    <div className="border-b border-gray-100 pb-4 last:border-0">
      <div className="flex items-start gap-3">
        {comment.user.imageUrl ? (
          <img src={comment.user.imageUrl} alt="" className="mt-1 h-8 w-8 rounded-full object-cover" />
        ) : (
          <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            {comment.user.username.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-gray-900">{comment.user.username}</span>
            <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
          {editing ? (
            <div className="mt-1">
              <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)}
                className="w-full resize-none border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand"
                rows={3} />
              <div className="mt-2 flex gap-2">
                <button onClick={() => { onEdit?.(comment.id, editBody); setEditing(false); }}
                  className="rounded-sm bg-brand px-3 py-1.5 text-xs font-semibold text-white">
                  {t('comments.save')}
                </button>
                <button onClick={() => { setEditing(false); setEditBody(comment.body); }}
                  className="rounded-sm border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600">
                  {t('comments.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-700">{comment.body}</p>
          )}
          <div className="mt-2 flex items-center gap-4">
            {user && (
              <button onClick={() => setShowReply(!showReply)}
                className="text-xs font-semibold text-gray-500 hover:text-brand transition-colors">
                {t('comments.reply')}
              </button>
            )}
            {canModify && (
              <>
                <button onClick={() => { setEditing(true); setEditBody(comment.body); }}
                  className="text-xs font-semibold text-gray-500 hover:text-brand transition-colors">
                  {t('comments.edit')}
                </button>
                <button onClick={() => onDelete(comment.id)}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">
                  {t('comments.delete')}
                </button>
              </>
            )}
          </div>
          {showReply && (
            <div className="mt-3">
              <CommentForm onSubmit={handleReply} placeholder={t('comments.writeReply')}
                submitLabel={t('comments.reply')} isSubmitting={isAdding} />
            </div>
          )}
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 mt-3 space-y-3 border-l-2 border-gray-200 pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-3">
              {reply.user.imageUrl ? (
                <img src={reply.user.imageUrl} alt="" className="mt-1 h-6 w-6 rounded-full object-cover" />
              ) : (
                <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-[10px] font-bold text-white">
                  {reply.user.username.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-gray-900">{reply.user.username}</span>
                  <span className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-1 text-sm text-gray-700">{reply.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
