import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Category names come from the database in one language; known slugs are translated via
 * nav.categories.<slug>, anything else falls back to the stored name.
 */
export function useCategoryName() {
  const { t } = useTranslation();
  return useCallback(
    (category: { slug: string; name: string }) =>
      t(`nav.categories.${category.slug}`, { defaultValue: category.name }),
    [t],
  );
}
