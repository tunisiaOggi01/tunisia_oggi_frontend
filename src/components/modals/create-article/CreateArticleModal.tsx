import { useCreateArticleForm } from './useCreateArticleForm';
import { ArticleFormFields } from './ArticleFormFields';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

/** Modal shell: wires useCreateArticleForm to ArticleFormFields and the Save Draft / Publish Now actions. */
export function CreateArticleModal({ isOpen, onClose, onCreated }: Props) {
  const form = useCreateArticleForm(onCreated, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold">Create New Article</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <ArticleFormFields {...form} />

        <div className="mt-6 flex justify-between">
          <button type="button" onClick={onClose} className="text-sm text-gray-600">
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!form.canSubmit}
              onClick={() => form.submit('DRAFT')}
              className="rounded border border-brand px-4 py-2 text-sm text-brand disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="button"
              disabled={!form.canSubmit}
              onClick={() => form.submit('PUBLISHED')}
              className="rounded bg-brand px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              Publish Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
