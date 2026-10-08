import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'it', label: 'IT' },
];

interface LanguageSwitcherProps {
  className?: string;
  itemClassName?: string;
  onSelect?: (lang: string) => void;
}

/** Inline EN/FR/IT switcher: changes the i18n language and persists it to localStorage. */
export function LanguageSwitcher({ className = 'flex gap-1', itemClassName = '', onSelect }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();

  function switchLang(lang: string) {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
    onSelect?.(lang);
  }

  return (
    <div className={className} role="group" aria-label={t('common.language')}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => switchLang(l.code)}
          className={`rounded-sm px-2.5 py-1.5 text-xs font-semibold transition-colors ${
            i18n.language === l.code ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } ${itemClassName}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
