import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  onSubmit: (body: string) => void;
  placeholder?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function CommentForm({ onSubmit, placeholder, submitLabel, isSubmitting }: Props) {
  const { t } = useTranslation();
  const [body, setBody] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || isSubmitting) return;
    onSubmit(body.trim());
    setBody('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <textarea value={body} onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder ?? t('comments.writeComment')} rows={2}
        className="min-h-[40px] flex-1 resize-none border border-gray-300 px-3 py-2 text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10" />
      <button type="submit" disabled={!body.trim() || isSubmitting}
        className="self-end rounded-sm bg-brand px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-brand-dark disabled:opacity-50">
        {submitLabel ?? t('comments.post')}
      </button>
    </form>
  );
}
