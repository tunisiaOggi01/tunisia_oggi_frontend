import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useComments } from '../../hooks/comments/useComments';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';

interface Props {
  publicationId: string | undefined;
}

export function CommentSection({ publicationId }: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { comments, isLoading, add, update, remove, isAdding } = useComments(publicationId);

  return (
    <section className="mt-12 border-t-4 border-gray-900 pt-8">
      <h2 className="mb-6 font-headline text-headline-md text-gray-900">{t('comments.heading')}</h2>

      {user && (
        <div className="mb-8">
          <CommentForm onSubmit={(body) => add({ body })} isSubmitting={isAdding} />
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-400">{t('comments.loading')}</p>
      ) : !comments || comments.length === 0 ? (
        <p className="text-sm text-gray-400">{t('comments.none')}</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment}
              onReply={(body, parentId) => add({ body, parentId })}
              onEdit={(id, body) => update({ id, body })}
              onDelete={(id) => remove(id)} isAdding={isAdding} />
          ))}
        </div>
      )}
    </section>
  );
}
