import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'it', label: 'Italiano' },
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
];

interface LanguageSwitcherProps {
  className?: string;
  onSelect?: (lang: string) => void;
}

/** IT/FR/EN select: changes the i18n language and persists it to localStorage. */
export function LanguageSwitcher({ className = '', onSelect }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();

  function switchLang(lang: string) {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
    onSelect?.(lang);
  }

  return (
    <div className={`relative ${className}`}>
      <span
        aria-hidden="true"
        className="material-symbols-outlined pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[16px] text-brand"
      >
        language
      </span>
      <select
        value={i18n.resolvedLanguage ?? i18n.language}
        onChange={(e) => switchLang(e.target.value)}
        aria-label={t('common.language')}
        className="h-[34px] w-full cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white pl-8 pr-8 text-xs font-semibold text-gray-700 transition-colors hover:border-brand focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="material-symbols-outlined pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[18px] text-gray-400"
      >
        expand_more
      </span>
    </div>
  );
}
