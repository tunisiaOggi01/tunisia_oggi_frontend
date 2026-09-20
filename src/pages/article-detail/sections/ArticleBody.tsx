import { useMemo } from 'react';
import { AdSlot } from '../../../components/ads/AdSlot';
import type { Publication } from '../../../api/publications/types';

interface Props {
  publication: Publication;
}

function textToHtml(text: string): string {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped.split('\n').filter(Boolean).map((p) => `<p>${p}</p>`).join('\n');
}

function splitParagraphs(html: string): string[] {
  return html.split('\n');
}

/** Body rendering with paragraph breaks, in-article ad slot, and tag list. */
export function ArticleBody({ publication }: Props) {
  const paragraphs = useMemo(() => splitParagraphs(textToHtml(publication.body)), [publication.body]);
  const splitIndex = Math.max(1, Math.ceil(paragraphs.length / 2));

  return (
    <>
      <div className="space-y-6 text-body-lg leading-relaxed text-gray-900">
        {paragraphs.slice(0, splitIndex).map((p, i) => (
          <div key={i} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
        <div className="my-8">
          <AdSlot placement="IN_ARTICLE" />
        </div>
        {paragraphs.slice(splitIndex).map((p, i) => (
          <div key={splitIndex + i} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
      </div>

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
