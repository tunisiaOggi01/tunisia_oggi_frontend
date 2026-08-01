import { useMemo } from 'react';
import type { Publication } from '../../../api/publications/types';

interface Props {
  publication: Publication;
}

function textToHtml(text: string): string {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped.split('\n').filter(Boolean).map((p) => `<p>${p}</p>`).join('\n');
}

/** Body rendering with paragraph breaks and tag list. */
export function ArticleBody({ publication }: Props) {
  const html = useMemo(() => textToHtml(publication.body), [publication.body]);

  return (
    <>
      <div className="space-y-6 text-body-lg leading-relaxed text-gray-900"
        dangerouslySetInnerHTML={{ __html: html }} />

      {publication.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2 border-t border-gray-200 pt-6">
          {publication.tags.map((tag) => (
            <span key={tag}
              className="bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500 transition-all hover:bg-brand hover:text-white">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
