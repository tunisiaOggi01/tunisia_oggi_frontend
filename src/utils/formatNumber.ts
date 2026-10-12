/** Formats a number with the app's language (it/fr/en) rather than the OS locale. */
export function formatNumber(n: number, language: string): string {
  const locale =
    language === 'fr' ? 'fr-FR' : language === 'it' ? 'it-IT' : 'en-US';
  return n.toLocaleString(locale);
}
