/**
 * Formats a date string with the locale-aware long format (it/fr/en), matching the app's
 * language setting — never the en-US default. Pass `options` for a shorter format.
 */
export function formatDate(
  date: string,
  language: string,
  options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' },
): string {
  const locale =
    language === 'fr' ? 'fr-FR' : language === 'it' ? 'it-IT' : 'en-US';
  return new Date(date).toLocaleDateString(locale, options);
}
