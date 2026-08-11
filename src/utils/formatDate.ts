/**
 * Formats a date string with the locale-aware long format (it/fr/en), matching the app's
 * language setting — never the en-US default.
 */
export function formatDate(date: string, language: string): string {
  const locale =
    language === 'fr' ? 'fr-FR' : language === 'it' ? 'it-IT' : 'en-US';
  return new Date(date).toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}