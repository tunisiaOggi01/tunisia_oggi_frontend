import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/** Search icon button that opens a dropdown with a large text input on click. Closes on outside click or Escape. */
export function SearchPopup() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('mousedown', handleClick); document.removeEventListener('keydown', handleKey); };
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    setQuery('');
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="material-symbols-outlined flex items-center justify-center p-2.5 text-[22px] text-gray-500 hover:text-brand transition-colors">
        search
      </button>
      {open && (
        <div ref={popupRef}
          className="absolute right-0 top-full mt-2 w-80 rounded-sm border border-gray-200 bg-white p-4 shadow-lg">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder={t('components.search.placeholder')}
              className="flex-1 border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
            <button type="submit"
              className="bg-brand px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90">
              {t('components.search.go')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
