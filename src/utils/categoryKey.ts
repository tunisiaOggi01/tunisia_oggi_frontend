/** Maps a BusinessCategory enum value (e.g. REAL_ESTATE) to its camelCase i18n key (e.g. realEstate). */
export function toCategoryKey(category: string): string {
  return category.toLowerCase().replace(/_[a-z]/g, (match) => match[1].toUpperCase());
}
